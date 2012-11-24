;(function($) {
	var jqPluginName = 'slider';
	var Init = function(element, options) 
		{
		var config = $.extend(true, {}, $.fn[jqPluginName].defaults, options);
		config.context = element;
		
		var sel_slide = 0; //текущий слайд
		var slide_length = $(config.context).find(config.slide_select).length-1; //всего слайдов
		var img_length = $(config.context).find('img').length; //количество изображений вообще
		var load_counter = 0; //количество загруженных изображений
		
		
		// фабрика слайдов методы виды анимаций на слайде
		var slider = function(src)
			{
			var self = {src: src};
			self['title'] = $(config.control_select+config.control_title_select).eq(self.src.index());
			var ani_cas = 0;
			self.hideCould =  function(obj,call)
				{
				obj.animate({
						opacity: 0,
						width: '10px',
						left: '539px',
						top: '198px'
						},200,
					function()
						{
						if (!obj.is(':animated'))
							{
							obj.attr('style','').hide()
							call();
							}
						});
				};
			self.showCould =  function(obj,call)
				{
				var old = {
					width: obj.eq(ani_cas).attr('style','').width()+'px',
					left: obj.eq(ani_cas).css('left'),
					top: obj.eq(ani_cas).css('top'),
					};
				if (ani_cas<=(obj.length-1))
					obj.eq(ani_cas)
						.css({
							opacity: 0,
							width: '10px',
							left: '539px',
							top: '198px'
							})
						.animate({
							opacity: 1,
							width: old.width,
							left: old.left,
							top: old.top
							}, 200,
						function()
							{
							ani_cas++;
							self.showCould(obj,call);
							});
				else
					{
					call();
					ani_cas = 0;
					}
				};
			self.moveTop = function(obj,call)
				{
				var old = {
					top: obj.attr('style','').css('top')
					};
				obj
					.css({
						top: '500px'
						})
					.animate({
						top: old.top
						}, 400,	call);
				
				};
			self.moveBottom = function(obj,call)
				{
				obj
					.show()
					.animate({
						top: '500px'
						}, 400,
					function()
						{
						obj.hide();
						call();
						});
				};
			return self;
			};
		
		//словарь анимаций воявлений слайдов
		var showSlideDict = {
			'0': function(obj)
				{
				return function(call)
					{
					obj.src.show().find(config.could_select).hide();
					obj.moveTop(obj.src.find('#men').hide(),function()
						{
						obj.showCould(obj.src.find(config.could_select),function()
							{
							obj.title.fadeIn('slow', function()
								{
								call(obj);
								});
							});
						});
					};
				},
			'1': function(obj)
				{
				return function(call)
					{
					obj.src.show();
					var men = obj.src.find('#men2').hide();
					obj.moveTop(obj.src.find('#monitor').hide(),function()
						{
						obj.moveTop(men,function()
							{
							obj.title.fadeIn('slow', function()
								{
								call(obj);
								});
							});
						});
					};
				},
			'2': function(obj)
				{
				return function(call)
					{
					obj.src.show();
					var men = obj.src.find('#men3').hide();
					obj.moveTop(obj.src.find('#monitor2').hide(),function()
						{
						obj.moveTop(men,function()
							{
							obj.title.fadeIn('slow', function()
								{
								call(obj);
								});
							});
						});
					};
				},
			'3': function(obj)
				{
				return function(call)
					{
					obj.src.show().find(config.could_select).hide();
					obj.src.find('#blocks,#men4').hide();
					obj.moveTop(obj.src.find('#blocks'),function()
						{
						obj.moveTop(obj.src.find('#men4'),function()
							{
							obj.showCould(obj.src.find(config.could_select),function()
								{
								obj.title.fadeIn('slow', function()
									{
									call(obj);
									});
								});
							});
						});
					};
				},
			};
			
		//словарь анимаций исчезновений анимаций
		var hideSlideDict = {
			'0': function(obj)
				{
				return function(call)
					{
					obj.title.fadeOut('slow', function()
						{
						obj.hideCould(obj.src.find(config.could_select),function()
							{
							obj.moveBottom(obj.src.find('#men'),function()
								{
								call(obj);
								});
							});
						});
					}
				},
			'1': function(obj)
				{
				return function(call)
					{
					obj.title.fadeOut('slow', function()
						{
						obj.moveBottom(obj.src.find('#men2').hide(),function()
							{
							obj.moveBottom(obj.src.find('#monitor').hide(),function()
								{
								call(obj);
								});
							});
						});
					}
				},
			'2': function(obj)
				{
				return function(call)
					{
					obj.title.fadeOut('slow', function()
						{
						obj.moveBottom(obj.src.find('#men3').hide(),function()
							{
							obj.moveBottom(obj.src.find('#monitor2').hide(),function()
								{
								call(obj);
								});
							});
						});
					}
				},
			'3': function(obj)
				{
				return function(call)
					{
					obj.title.fadeOut('slow', function()
						{
						obj.hideCould(obj.src.find(config.could_select),function()
							{
							obj.moveBottom(obj.src.find('#men4'),function()
								{
								obj.moveBottom(obj.src.find('#blocks'),function()
									{
									call(obj);
									});
								});
							});
						});
					}
				},
			};
		
		//определение состояния котроля слайдов
		function set_control()
			{
			var obj = 0;
			if (sel_slide==0)
				obj = $(config.control_select + config.prev_select)
			else if (sel_slide==slide_length)
				obj = $(config.control_select + config.next_select)
			$(config.control_select + config.prev_select+','+config.control_select + config.next_select).addClass('ena').removeClass('dis');
			if (obj)
				obj.addClass('dis').removeClass('ena');
			}
			
		//блокировка контролера
		function un_set_control()
			{
			$(config.control_select + config.prev_select+','+config.control_select + config.next_select).removeClass('ena').addClass('dis');
			}
		
		//формирование списка объектов
		var slide_list = [];
		$(config.context)
			.find(config.slide_select)
			.each(function()
				{
				var self = $(this);
				var new_side = slider(self);
				new_side.showSlide = showSlideDict[self.index()](new_side);
				new_side.hideSlide = hideSlideDict[self.index()](new_side);
				slide_list.push(new_side);
				});
		
		//управление анимациями из контроллера
		function next_slide(e)
			{
			var button = $(e.target).is('img')?$(e.target).closest('div'):$(e.target);
			var delta = button.is(config.control_select+config.next_select)?1:-1;
			if (button.is('.ena'))
				{
				un_set_control();
				slide_list[sel_slide].hideSlide(function()
					{
					sel_slide += delta;
					slide_list[sel_slide].showSlide(function()
						{
						set_control();
						});
					});
				}
			};
		
		//загрузка изображений
		$(config.context).find('img').one('load',function()
			{
			load_counter += 1;
			if (load_counter == img_length)
				{
				slide_list[sel_slide].showSlide(function(obj)
					{
					sel_slide = obj.src.index();
					set_control();
					});
				//привязка событий контролера
				$(config.control_select+config.next_select+","+config.control_select+config.prev_select).on('click',next_slide);
				}
			})
			.each(function()
			{
			if(this.complete)
				$(this).load();
			});
		}
	$.fn[jqPluginName] = function(options) 
		{
		return this.each(function () 
			{
			var _this = $(this);
			if (!_this.data(jqPluginName))
				new Init(_this, options);
			});
		}
	$.fn[jqPluginName].defaults = 
		{
		slide_select: 'li',
		could_select: '.could',
		control_select: '#slider_action',
		control_title_select: ' h1',
		next_select: ' .next',
		prev_select: ' .prev',
		}	
})(jQuery);