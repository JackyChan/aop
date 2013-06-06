/**
 * aop.js
 * 
 * JS AOP Library
 *
 * @author Jacky
 */

(function(window){
	// 是否禁用AOP，默认为false
	if (typeof disable_aop == 'undefined') {
		disable_aop = false;
	}
	
	var beforeAdviceKey = 'before';
	var aroundAdviceKey = 'around';
	var afterAdviceKey = 'after';

	/**
	 * 切点对象类
	 */
	var AopJoinPoint = function() {
		var _args;
		var _returnedValue;
		var _joinPoint;
		var _scope;
		var _kind;

		this.getArguments = function() {
			return _args;
		}

		this.setArguments = function(args) {
			_args = args;
		}

		this.getReturnedValue = function() {
			return _returnedValue;
		}

		this.setReturnedValue = function(value) {
			_returnedValue = value;
		}

		this.setKindOfAdvice = function(kind) {
			_kind = kind;
		}

		this.getKindOfAdvice = function() {
			return _kind;
		}

		this.setJoinPoint = function(joinPoint,scope) {
			_joinPoint = joinPoint;
			_scope = scope;
		}

		this.getJoinPoint = function() {
			return _joinPoint;
		}

		this.process = function() {
			return _joinPoint.apply(_scope, this.getArguments());
		}
	}

	/**
	 * aop 处理过程
	 * 
	 * @param Function func
	 * @return Function
	 */
	var __aop_process = function(func) {
		var aop_process = function() {
			if (disable_aop === true) {
				return func.apply(this, arguments);
			}
	
			var args = Array.prototype.slice.apply(arguments);
			var aopJoinPoint = new AopJoinPoint();
			aopJoinPoint.setArguments(args);
			aopJoinPoint.setJoinPoint(func, this);
			var beforeAdvices = aop_process[beforeAdviceKey];
			var aroundAdvices = aop_process[aroundAdviceKey];
			var afterAdvices = aop_process[afterAdviceKey];
			var len = 0;

			if (beforeAdvices && beforeAdvices.length) {
				len = beforeAdvices.length;
				for (var i = 0; i < len; i++) {
					aopJoinPoint.setKindOfAdvice(beforeAdviceKey);
					beforeAdvices[i].apply(this,[aopJoinPoint]);
				}
			}

			if (aroundAdvices && aroundAdvices.length) {
				len = aroundAdvices.length;
				for (var i = 0; i < len; i++) {
					aopJoinPoint.setKindOfAdvice(aroundAdviceKey);
					aopJoinPoint.setReturnedValue(aroundAdvices[i].apply(this,[aopJoinPoint]));
				}
			} else {
				aopJoinPoint.setReturnedValue(func.apply(this, aopJoinPoint.getArguments()));
			}

			if (afterAdvices && afterAdvices.length) {
				len = afterAdvices.length;
				for (var i = 0; i < len; i++) {
					aopJoinPoint.setKindOfAdvice(afterAdviceKey);
					afterAdvices[i].apply(this,[aopJoinPoint]);
				}
			}

			return aopJoinPoint.getReturnedValue();
		};
		aop_process.aop_process = true;
		return aop_process;
	};

	/**
	 * 添加前切点
	 *
	 * @param Function func
	 * @param Function advice
	 * @return Function
	 */
	var aop_add_before = function(func, advice) {
		if (!func.aop_process) {
			func = __aop_process(func);
		}

		var advices = func[beforeAdviceKey];

		if (null == advices) {
			advices = [];
			func[beforeAdviceKey] = advices;
		}

		advices.push(advice);
		return func;
	}

	/**
	 * 添加后切点
	 *
	 * @param Function func
	 * @param Function advice
	 * @return Function
	 */
	var aop_add_after = function(func, advice) {
		if (!func.aop_process) {
			func = __aop_process(func);
		}

		var advices = func[afterAdviceKey];

		if (null == advices) {
			advices = [];
			func[afterAdviceKey] = advices;
		}

		advices.push(advice);
		return func;
	}

	/**
	 * 添加环绕切点
	 *
	 * @param Function func
	 * @param Function advice
	 * @return Function
	 */
	var aop_add_around = function(func, advice) {
		if (!func.aop_process) {
			func = __aop_process(func);
		}

		var advices = func[aroundAdviceKey];

		if (null == advices) {
			advices = [];
			func[aroundAdviceKey] = advices;
		}

		advices.push(advice);
		return func;
	}
	
	window.AopJoinPoint = AopJoinPoint;
	window.aop_add_before = aop_add_before;
	window.aop_add_after = aop_add_after;
	window.aop_add_around = aop_add_around;
})(window);