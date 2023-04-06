/*----------------------------- counter -----------------------------*/
(function($){
	const 
	defaults = {
		namespace:'counter_', 
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
		setTime:1000, 
		funcCallbackError:(el) => {
			console.log('plugin counter img load error');
			//el.html('エラーが発生しました。');
		}, 
		funcCallbackFinish:(el) => {
			el.html('終了致しました。');
		} 
	}, 
	timeList = [
		'day', 
		'hour', 
		'minute', 
		'second', 
		'micro_second' 
	], 
	selectorRule = {
		id:'#', 
		class:'.' 
	};
	$.fn.counter = function(options){
		let 
		el = this, 
		lenEl = el.length;
		if(lenEl === 0)
		return this;
		if(lenEl > 1){
			el.each(function(){
				$(this).counter(options);
			});
			return this;
		}
		let 
		configs = {}, 
		timeFinish, 
		imgChach = {}, 
		funcInit = () => {
			configs = $.extend(
				{}, 
				defaults, 
				options 
			);
			timeFinish = Date.parse(configs.finishTime);
			for(var i = 0, l = timeList.length;i < l;++i)
			configs.counterTemplate = configs.counterTemplate.replace(
				'{' + timeList[i] + '}', 
				'<span class="' + configs.namespace + timeList[i] + '"></span>' 
			);
			el.html(configs.counterTemplate);
			const 
			numberLength = funcGetNumberLength();
			funcLoadImg(
				0, 
				numberLength, 
				funcExecute 
			);
		}, 
		funcDestructor = () => {
			lenEl = 
			funcInit = 
			funcGetNumberLength = 
			funcLoadImg = 
			funcDestructor = void 0;
		}, 
		funcGetNumberLength = () => {
			let 
			timeNow = parseInt(new Date() * 1), 
			timeLimit = timeFinish - timeNow, 
			timeRemaining = funcGetRemainingTime(timeLimit), 
			conut = 0;
			for(var key in timeRemaining)
			conut += timeRemaining[key].length;
			return conut;
		}, 
		funcLoadImg = (
			index, 
			numberLength, 
			callback 
		) => {
			if(configs.number[index].match(/[.jpg|.gif]|.png|.svg]$/)){
				imgChach[index] = [];
				for(var i = 0;i < numberLength;++i){
					imgChach[index][i] = $('<img>');
					imgChach[index][i].attr(
						'src', 
						configs.number[index] 
					);
				}
				imgChach[index][0].on({
					'load':() => {
						if(index === 9){
							funcDestructor();
							callback();
						}else{
							funcLoadImg(
								index + 1, 
								numberLength, 
								callback 
							);
						}
					}, 
					'error':() => {
						configs.funcCallbackError(el);
					} 
				});
				return false;
			}
			if(index === 9){
				funcDestructor();
				callback();
				return false;
			}
			funcLoadImg(
				index + 1, 
				numberLength, 
				callback 
			);
		}, 
		funcGetRemainingTime = (time) => {
			let 
			day = Math.floor(time / 86400 / 1000) + '', 
			hour = Math.floor((time / 3600 / 1000) % 24) + '', 
			minute = Math.floor((time / 60 / 1000) % 60) + '', 
			second = Math.floor((time / 1000) % 60) + '', 
			microSecond = (time % 1000) + '', 
			lenHour = hour.length, 
			lenMinute = minute.length, 
			lenSecond = second.length, 
			lenMicroSecond = microSecond.length;
			if(configs.numberFormat){
				if(lenHour < 2){
					for(var i = 0, l = 2 - lenHour;i < l;++i)
					hour = '0' + hour;
				}
				if(lenMinute < 2){
					for(var i = 0, l = 2 - lenMinute;i < l;++i)
					minute = '0' + minute;
				}
				if(lenSecond < 2){
					for(var i = 0, l = 2 - lenSecond;i < l;++i)
					second = '0' + second;
				}
			}
			if(lenMicroSecond < 3){
				for(var i = 0, l = 3 - lenMicroSecond;i < l;++i)
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
		funcPutTime = (time) => {
			let 
			tempTime = 0, 
			countNumberLength = 0;
			for(var key in time){
				eleTime = $(selectorRule.class + configs.namespace + key, el).eq(0);
				if(!eleTime[0]){
					tempTime = (key === 'day'?tempTime * 0:key === 'second'?tempTime * 10:tempTime * 60) + parseInt(time[key]) * (key === 'day'?24:key === 'second'?10:60);
					continue;
				}
				eleTime.empty();
				if(tempTime !== 0)
				time[key] = (parseInt(time[key]) + tempTime) + '';
				for(var i = 0, l = time[key].length;i < l;++i){
					let 
					number = time[key].substr(
						i, 
						1 
					);
					if(
						typeof imgChach[number] === 'object' && 
						typeof imgChach[number][countNumberLength] === 'object' 
					){
						eleTime.append(imgChach[number][countNumberLength]);
						++countNumberLength;
					}else{
						eleTime.append('<span class="' + configs.namespace + 'num">' + configs.number[number] + '</span>');
					}
				}
				tempTime = 0;
			}
		}, 
		funcExecute = () => {
			let 
			timeNow = parseInt(new Date() * 1);
			if(timeFinish <= timeNow){
				configs.funcCallbackFinish(el);
				return true;
			}
			let 
			timeLimit = timeFinish - timeNow, 
			timeRemaining = funcGetRemainingTime(timeLimit);
			funcPutTime(timeRemaining);
			setTimeout(
				funcExecute, 
				configs.setTime 
			);
		};
		funcInit();
		return this;
	};
})(jQuery);
/*----------------------------- /counter -----------------------------*/