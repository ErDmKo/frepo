function Grid(content)
	{
	if(!(this instanceof Grid))
		return new Grid(content);
		
	var pos; //текущее положение x, y
	var grid; // 2х мерный масив сетки 
	var lastEmpty;
	var dir = 1; // Direction 1 for right, -1 for left
	var rows;
	var self = this;
	
	// отображение сетки
	var scale = {
		x: 200, y: 100, //размер
		calculated: 200
		}; 
	var margin = 10; //отступы
	
	
	// строка сетки масив длиной колонок, возвращает номер r если она уже есть
	var row = function(r)
		{
		if(grid[r])
			return grid[r];
		
		// возвращает номер r если она уже есть
		var row = [];
		for(var x=0;x<columns;x++)
			row.push(0);
		//console.log("новая колонка!: %j",row)
		grid.push(row);

		self.rows = grid.length;
		return row;
		}
	
	//ищет следующий пустой элемет
	var nextEmpty = function()
		{
		var ey = grid.length,
			sx = dir < 0 ? columns-1 : 0,
			ex = dir > 0 ? columns   : 0;

		for(var y=lastEmpty; y<ey;y++)
			{
			var r = row(y)
			for(var x=sx;dir>0?x<ex:x>ex;x+=dir)
				{
				if(r[x]==0)
					{
					pos.x = x;
					pos.y = lastEmpty = y;
					return pos;
					}
				}
			}
		return pos
		}

	// Умещается ли объект в сетку
	var fits = function(cols,rows)
		{
		// Не подходит если за горизонталью
		if(dir > 0 && pos.x+cols > columns)
			return false;
		if(dir < 0 && pos.x-cols < 0)
			return false;
		

		// проверки по вертикали
		var ey = pos.y+rows,
			ex = dir > 0 ? pos.x+cols : pos.x-cols;

    // Проходим все координаты объекта по сетке,создавая её
    // ложь если коодината уже занята
		for(var y=pos.y; y<ey;y++)
			{
			var r = row(y);
			for(var x=pos.x;dir>0?x<ex:x>ex;x+=dir)
				{
				//console.log("%d,%d:",x,y,r[x]);
				if(r[x]!=0)
					return false;
				}
			}
		return true;
		}
	
	//вставка обекта с учетом текущего значения pos вычесленного из next
	var increment = function(cols,rows)
		{
		//console.log('obj %dx%d inc to %d:%d', cols,rows, pos.x,pos.y);
		var ey = pos.y+rows,
			ex = dir > 0 ? pos.x+cols : pos.x-cols,
			cahe_pos = $.extend({}, pos);
			
		for(var y=pos.y; y<ey;y++)
			{
			var r = row(y)
			for(var x=pos.x;dir > 0 ? x<ex : x>ex;x+=dir)
				r[x] += y == pos.y || x >= ex-1 ? 1 : 2;
			}
		pos = nextEmpty()
		return cahe_pos;
		}
	
	var obj_css = function(elpos, cols, rows)
		{
		return {
			top: elpos.y*scale.y,
			left: elpos.x*scale.calculated,
			width: cols*scale.calculated - margin,
			height: rows*scale.y - margin
			};
		}
		
	this.resize = function()
		{
		var width = content.width();
		columns = Math.floor(width/scale.x);
		scale.calculated = scale.x + ( width + margin - scale.x*columns)/columns;
		grid = [];
		pos = dir > 0 ? {x:0,y:0} : {x:columns-1,y:0};
		lastEmpty = 0;
		return this
		}
		
	// Вствка нового обекта в сетку
	this.next = function(cols,rows)
		{
		var count = 0
		while(1)
			{
			count++;
			if(fits(cols,rows))
				return increment(cols,rows);
			if (count>=100)
				return false;
			pos.x += dir;
			if( pos.x > columns )
				{
				pos.x  = 0;
				pos.y += 1;
				}
			else if(pos.x < 0)
				{
				pos.x  = columns-1;
				pos.y += 1;
				}
			}
		}

	// последовательная вставка объектов в сетку и рендеринг объектов
	this.render = function()
		{
		this.resize();
		console.log('sd');
		var grid = this;
		content.children().each(function()
			{
			var el = $(this);
			var cols = parseInt(el.data("cols")),
				rows = parseInt(el.data("rows"));
			el.css('position', 'absolute').stop(true).animate(obj_css(grid.next(cols,rows), cols, rows), 500);
			});
		}

	this.render();
	}

$(document).on('ready',function()
	{
	var grid = new Grid($('#box-list'));
	$(window).on('resize', function(){grid.render()});
	});