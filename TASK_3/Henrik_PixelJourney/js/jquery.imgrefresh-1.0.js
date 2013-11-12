/* 
Name: Image-Refresh
Author: Thomas Mutton
Version: 1.0 
Date: 27-08-2012
*/

(function ($)
{
    $.fn.imgrefresh = function (options)
    {
        var settings = $.extend({
            'qsname': 'refresh'
        }, options);

        var nme = settings.qsname;
        var src = this.attr('src').split('?');
        var url = src[0];
        var qs = src[1];
        var dt = new Date().getMilliseconds();

        // check QS empty or no name value
        qs = (qs == null) ? (nme + '=' + dt) : qs = (qs.indexOf(nme + '=') == -1) ? (qs += '&' + nme + '=' + dt) : qs;

        var x = '';
        var b = qs.split('&');

        for (var i = 0; i < b.length; i++)
        {
            var cVar = b[i].split('=');
            var name = cVar[0];
            var val = cVar[1];
            var prefix = i > 0 ? '&' : '';
            var newval = (name == nme ? dt : val);
            x += (prefix + name + '=' + newval);
        }

        this.attr('src', url + '?' + x);
    };
})(jQuery);