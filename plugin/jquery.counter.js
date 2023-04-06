/*----------------------------- counter -----------------------------*/
(function($){
	var 
	defaults = {
		finishTime:'1970/1/1 00:00:00', 
		counterTemplate:'{day}日{hour}時間{minute}分{second}秒{micro_second}', 
		numberFormat:true, 
		number:{
			0:'0', 
			1:'1', 
			2:'2', 
			3:'3', 
			4:'4', 
			5:'5', 
			6:'6', 
			7:'7', 
			8:'8', 
			9:'9' 
		}, 
		setTime:111, 
		//callback
		funcTimeHalfwayCallback:function(el, timeLimit){
			el.flagFuncTimeHalfwayCallback = false;
		}, 
		funcFinishCallback:function(el){
			el.html('終了致しました。');
		} 
	}, 
	timeList = [
		'day', 
		'hour', 
		'minute', 
		'second', 
		'micro_second' 
	];
	$.fn.counter = function(options){
		var 
		el = this, 
		lenEl = el.length;
		if(lenEl === 0)return this;
		if(lenEl > 1){
			el.each(function(){$(this).counter(options)});
			return this;
		}
		var 
		timeFinish, 
		imgChach = {}, 
		funcInit = function(){
			el.configs = $.extend({}, defaults, options);
			timeFinish = Date.parse(el.configs.finishTime.replace(/-/g, '/'));
			for(var i = 0, l = timeList.length;i < l;i++)
			el.configs.counterTemplate = el.configs.counterTemplate.replace('{' + timeList[i] + '}', '<span class="' + timeList[i] + '"></span>');
			el.html(el.configs.counterTemplate);
			el.funcLoadImg(0, function(){
				el.funcExecute();
			});
		};
		el.configs = {};
		el.setTime;
		el.flagFuncTimeHalfwayCallback = true;
		el.funcLoadImg = function(index, callback){
			if(el.configs.number[index].match(/[.jpg|.gif]|.png]$/)){
				var 
				eleImg = $('<img>');
				eleImg.on({
					'load':function(){
						imgChach[index] = $(this);
						if(index === 9){
							callback();
						}else{
							el.funcLoadImg(index + 1, callback);
						}
					}, 
					'error':function(){
						console.log('plugin counter img load error');
					} 
				});
				eleImg.attr('src', el.configs.number[index]);
			}else{
				if(index === 9){
					callback();
				}else{
					el.funcLoadImg(index + 1, callback);
				}
			}
		}, 
		el.funcGetRemainingTime = function(time){
			var 
			day = Math.floor(time / 86400 / 1000) + '', 
			hour = Math.floor((time / 3600 / 1000) % 24) + '', 
			minute = Math.floor((time / 60 / 1000) % 60) + '', 
			second = Math.floor((time / 1000) % 60) + '', 
			microSecond = (time % 1000) + '', 
			lenHour = hour.length, 
			lenMinute = minute.length, 
			lenSecond = second.length, 
			lenMicroSecond = microSecond.length;
			if(el.configs.numberFormat){
				if(lenHour < 2){
					for(var i = 0, l = 2 - lenHour;i < l;i++)
					hour = '0' + hour;
				}
				if(lenMinute < 2){
					for(var i = 0, l = 2 - lenMinute;i < l;i++)
					minute = '0' + minute;
				}
				if(lenSecond < 2){
					for(var i = 0, l = 2 - lenSecond;i < l;i++)
					second = '0' + second;
				}
			}
			if(lenMicroSecond < 3){
				for(var i = 0, l = 3 - lenMicroSecond;i < l;i++)
				microSecond = '0' + microSecond;
			}
			microSecond = microSecond.slice(0, 2);
			return {
				'day':day, 
				'hour':hour, 
				'minute':minute, 
				'second':second, 
				'micro_second':microSecond 
			};
		}, 
		el.funcPutTime = function(time){
			var 
			keepTime = 0;
			for(var key in time){
				eleTime = $('.' + key, el).eq(0);
				if(!eleTime[0]){
					keepTime = (key === 'day'?keepTime * 0:key === 'second'?keepTime * 10:keepTime * 60) + parseInt(time[key]) * (key === 'day'?24:key === 'second'?10:60);
					continue;
				}
				eleTime.empty();
				if(keepTime !== 0)
				time[key] = (parseInt(time[key]) + keepTime) + '';
				for(var i = 0, l = time[key].length;i < l;i++){
					var 
					number = time[key].substr(i, 1);
					if(typeof imgChach[number] === 'object'){
						eleTime.append(imgChach[number].clone());
					}else{
						eleTime.append('<span class="counter_num">' + el.configs.number[number] + '</span>');
					}
				}
				keepTime = 0;
			}
		}, 
		el.funcExecute = function(){
			var 
			timeNow = parseInt(new Date() * 1);
			if(timeFinish <= timeNow){
				el.configs.funcFinishCallback(el);
				return true;
			}
			var 
			timeLimit = timeFinish - timeNow;
			el.configs.funcTimeHalfwayCallback(el, timeLimit);
			var 
			timeRemaining = el.funcGetRemainingTime(timeLimit);
			el.funcPutTime(timeRemaining);
			el.setTime = setTimeout(
				function(){
					el.funcExecute();
				}, 
				el.configs.setTime 
			);
		};
		funcInit();
	};
})(jQuery);
/*----------------------------- /counter -----------------------------*/