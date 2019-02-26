// Jason Low's Font Loaded Test Class
// jason.low@impact360design.com
// ver 1.2
 
// Notes:
// v1.1 - baseFont set to Arial, skip test if tested font is same as base font
// v1.2 - added baseFont to font fallback
// v1.3 - replaced single quotes with double quotes for strings
 
// Usage Examples:
/*
this.fontTester = new ig.FontLoadedTest();
if(this.fontTester.testFont("myfont")){
    console.log("font loaded");
}
*/
 
ig.module( "plugins.font-loaded-test" )
.requires(
)
.defines(function(){
 
ig.FontLoadedTest = ig.Class.extend({
    // font as string
    testFont: function(font)
    {
        var baseFont = "arial";
        if(ig.ua.ios) baseFont = "times";
 
        if(font.toLowerCase() == baseFont) return true;
 
        var obj = ig.$new("canvas");
        obj.width = 40;
        obj.height = 40;
        var ctx = obj.getContext("2d");
 
        // Get Image Data from canvas
        function getImg(fon)
        {
        ctx.clearRect(0, 0, (obj).width, (obj).height);
        ctx.fillStyle = "rgba(0,0,0,1.0)";
        ctx.fillRect( 0, 0, 40, 40 );
        ctx.font = "20px "+ fon;
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(255,255,255,1.0)";
        ctx.fillText( "a", 18, 5 );
        return ctx.getImageData( 0, 0, 40, 40 );
        };
 
        var data1 = getImg(font + "," + baseFont);
        var data2 = getImg(baseFont);
 
        var isLoaded = false;
        for (var i=0; i<data1.data.length; i++)
        {
            if(data1.data[i] != data2.data[i])
                {isLoaded = true; break;}
        }
 
        if(!isLoaded)
            return false;
 
        return true;
    },
});
});