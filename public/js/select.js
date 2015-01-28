require(['jquery', 'selectize'], function ($) {
	$(function () {
		var renders = {
			member: {
				item: function (item, escape) {
					return '<div>' +
						(item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
						(item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
						'</div>';
				},
				option: function (item, escape) {
					var label = item.name || item.email;
					var caption = item.name ? item.email : null;
					return '<div>' +
						'<span class="">' + escape(label) + ' | </span>' +
						(caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
						'</div>';
				}
			}
		};

		$(".selectize").each(function() {
			var $this = $(this);
			$this.removeClass('selectize');
			var config = $.extend({
				persist: false,
				maxItems: null,
				valueField: '_id',
				labelField: 'name',
				create: false
			}, $this.data('config'));
			config.options = $this.data('options');
			config.render = renders[$this.data('render')];

			$(this).selectize(config);
		});
	});
}) ;
