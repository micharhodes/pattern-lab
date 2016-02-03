$dJ.NS('nflpbo.Comp').SimpleRetirementRangeInput = $dJ.Comp.Base.extend(function () {
	"use strict";

	return {
		$el: null,

		init: function (cfg) {
			var _this = this,
				DBG = $dJ.Debug;

			// Call superclass to call shared init and config
			this._super(cfg);

			// Validate the el parameter
			DBG('[nflpbo.Comp.SimpleRetirementRangeInput.init] typeof $el:', typeof _this.$el);
			if (typeof _this.$el === 'object' && _this.$el !== null && _this.$el !== 'undefined') {
                var el, newPoint, newPlace, offset, width;
                
                var currentAge,
                    retirementAge,
                    currentSavings,
                    rate,
                    estimatedLifeSpan,
                    monthlyDeposit,
                    periods;
                
                $.getJSON('../../data/financialData.json', function (data) {
                    currentAge = data.currentAge;
                    currentSavings = data.currentSavings;
                    rate = data.rate;
                    estimatedLifeSpan = data.estimatedLifeSpan;
                    monthlyDeposit = data.monthlyDeposit;
                    periods = data.periods;
                    
                    _this.$el.trigger('change');
                });

                // Select all range inputs, watch for change
                _this.$el.on("input change", function() {

                    // Cache this for efficiency
                    el = $(this);

                    // Measure width of range input
                    width = el.width();

                    // Figure out placement percentage between left and right of input
                    newPoint = (parseFloat(el.val()) - parseFloat(el.attr("min"))) / (parseFloat(el.attr("max")) - parseFloat(el.attr("min")));

                    offset = 0;

                    // Prevent bubble from going beyond left or right (unsupported browsers)
                    if (newPoint < 0) { newPlace = 0; }
                    else if (newPoint > 1) { newPlace = width; }
                    else { newPlace = width * newPoint + offset; offset -= newPoint; }

                    // Move bubble
                    el
                    .prev(".range-current")
                    .css({
                        left: 'calc(' + newPoint*100 + '%' + ' - 20px)'
                    })
                    .text(el.val());
                    
                    if (parseInt(el.val()) >= parseInt(el.attr('max')) - 3) {
                        el.parents('form').addClass('hide-max');
                    } else {
                        el.parents('form').removeClass('hide-max');
                    }
                    
                    if (parseInt(el.val()) <= parseInt(el.attr('min')) + 3) {
                        el.parents('form').addClass('hide-min');
                    } else {
                        el.parents('form').removeClass('hide-min');
                    }
                    
                    el.next('output').val('$' + _this.currencyFormatter(Math.round(_this.annualIncomeCalculator(currentAge, el.val(), currentSavings, rate, estimatedLifeSpan, monthlyDeposit, periods))));
                });
                
                $(window).resize(function() {
                    _this.$el.trigger('change');
                });
			}
		},
        
        annualIncomeCalculator: function(currentAge, retirementAge, currentSavings, rate, estimatedLifeSpan, monthlyDeposit, periods) {
            var periodicInterestRate = rate/periods,
                years = retirementAge - currentAge,
                compoundingPeriods = periods*years,
                valueAtRetirment,
                yearsWithdrawing = estimatedLifeSpan - retirementAge,
                annualIncome;
                
            valueAtRetirment = currentSavings*Math.pow((periodicInterestRate + 1), compoundingPeriods) + monthlyDeposit*((Math.pow((1 + periodicInterestRate), compoundingPeriods) - 1)/periodicInterestRate)*(1 + periodicInterestRate);
            annualIncome = valueAtRetirment/yearsWithdrawing; //annual income assuming no interest accrued after start of withdrawals
            
            return annualIncome;
        },
        
        currencyFormatter: function (num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }
	};
}());