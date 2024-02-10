
	/**
	 * 定义循环尝试运行
	 * 直到运行回调时不再抛出错误
	 * @param {function (number, number): void} callback 第一个参数为尝试运行的次数 第二个参数为尝试运行的时间
	 * @param {number} interval
	 * @param {boolean} [immediate]
	 */
	export function intervalTry(callback, interval, immediate = false)
	{
		let countOfCall = 0;
		let startTime = Date.now();
		let intervalId = null;
		let func = (() =>
		{
			countOfCall++;
			try
			{
				callback(countOfCall, Date.now() - startTime);
				if (intervalId != null)
					clearInterval(intervalId);
				return;
			}
			catch (err)
			{ }
		});
		intervalId = setInterval(func, interval);
		if (immediate)
			func();
	}