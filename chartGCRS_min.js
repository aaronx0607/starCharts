"use strict";var date,tipsEnabled,tips,highPrecCalInTips,animate_id,magLimitTip=5.3,stars=brightStars(),conLab=constellationLabel(),conLine=constellationLines(),magLimit=5.3,milky={northernEdge:northernEdge(),southernEdge:southernEdge(),betaCas:betaCas(),thetaOph:thetaOph(),lambdaSco:lambdaSco(),coalsack:coalsack()},animateDtStep=1,frameRate=40;function init(){var t=new Date,e=t.getUTCFullYear(),a=t.getUTCMonth()+1,n=t.getUTCDate(),r=t.getUTCHours(),i=t.getUTCMinutes(),o=t.getUTCSeconds()+.001*t.getUTCMilliseconds(),d=generateDateString(e,a,n),s=generateTimeString(r,i,o),l=getDm(e,a,n,0)+(r+i/60+o/3600)/24,c=l/36525,h=DeltaT(c);date={yyyy:e,mm:a,dd:n,h:r,m:i,s:o,dateString:d,timeString:s,D:l,T:c,dT:h},tipsEnabled=!0,tips=[[],[],[]],highPrecCalInTips=!0,$("#canvasNorth").on("click",function(t){displayPopup(t,"canvasNorth")}),$("#canvasCentral").on("click",function(t){displayPopup(t,"canvasCentral")}),$("#canvasSouth").on("click",function(t){displayPopup(t,"canvasSouth")}),starCharts()}function displayChangeTime(){var t="#changeTime";$("button.menu").attr("disabled",!0),$(t).empty(),$(t).slideDown();var e="<h2>Change Date and Time</h2>";$(t).append(e),e='<form name="changeTime" action="" method="get">',e+="<table>",e+='<tr><td>Year: <input type="number" id="yearIn" step="1" min=-200000 max=200000 /></td>',e+='<td>Month: <input type="number" id="monthIn" step="1" min=1 max=12 /></td>',e+='<td>Day: <input type="number" id="dayIn" step="1" min=1 max=31 /></td></tr>',e+='<tr><td>Hour: <input type="number" id="hourIn" step="1" min=0 max=23 /></td>',e+='<td>Minute: <input type="number" id="minuteIn" step="1" min=0 max=59 /></td>',e+='<td>Second: <input type="number" id="secondIn" step="any" min=0 max=60 /> UT</td></tr>',e+="</table><br />",e+='<p><input type="button" value="Submit" onclick="changeTimeAction(this.form)" /></p>',e+="</form>",$(t).append(e),e='<div id="changeTimeErrorlocs"></div>',$(t).append(e),$("#yearIn").val(date.yyyy),$("#monthIn").val(date.mm),$("#dayIn").val(date.dd),$("#hourIn").val(date.h),$("#minuteIn").val(date.m),$("#secondIn").val(date.s.toFixed(3))}function changeTimeAction(t){var e=parseInt(t.yearIn.value),a=parseInt(t.monthIn.value),n=parseInt(t.dayIn.value),r=parseInt(t.hourIn.value),i=parseInt(t.minuteIn.value),o=parseFloat(t.secondIn.value),d="#changeTimeErrorlocs";$(d).empty();var s=-2e5,l=2e5,c="Invalid year! Please enter an integer between "+s+" and "+l+". Note that 0 means 1 BCE, -1 means 2 BCE and so on. Note that the positions of the Sun, Moon and planets are only accurate for years between -3000 and 3000.";if(sanityCheck(e,"#yearIn",s,l,c,d),s=1,l=12,c="Invalid month! Month must be an integer between 1 and 12.",sanityCheck(a,"#monthIn",s,l,c,d),s=1,l=31,c="Invalid day! Day must be an integer between 1 and 31.",sanityCheck(n,"#dayIn",s,l,c,d),s=0,l=23,c="Invalid hour! Hour must be an integer between 0 and 23.",sanityCheck(r,"#hourIn",s,l,c,d),s=0,l=59,c="Invalid minute! Minute must be an integer between 0 and 59.",sanityCheck(i,"#minuteIn",s,l,c,d),s=0,l=60,c="Invalid second! Second must be a number between 0 and 60.",sanityCheck(o,"#secondIn",s,l,c,d),""==$(d).text()){var h="#changeTime";$(h).slideUp(),$(h).empty,$("button.menu").attr("disabled",!1);var m=getDm(e,a,n,0),p=CalDat(m),u=generateTimeString(r,i,o),y=(m+=(r+i/60+o/3600)/24)/36525,f=DeltaT(y);date={yyyy:p.yy,mm:p.mm,dd:p.dd,h:r,m:i,s:o,dateString:p.dateString,timeString:u,D:m,T:y,dT:f},starCharts()}}function starCharts(){if(Math.abs(date.yyyy)>3e3){if(""==$(".warning").text()){$(".warning").append('<p style="color:red;">Warning: Positions of the Sun, Moon and planets are not accurate at this time.</p>')}}else""!=$(".warning").text()&&$(".warning").empty();var t=Math.PI/12,e=Math.PI/180,a=$("#rotateNorth").val()*e,n=$("#raCentral").val()*t,r=$("#rotateSouth").val()*e,i=setupDrawingParameters();addLegend(i),i.showPlanets=$("#showPlanets").hasClass("active"),i.showPlanets&&(i.planets=sunMoonPlanets(date.T+date.dT)),i.showEcliptic=$("#showEcliptic").hasClass("active"),i.showMilkyWay=$("#showMilkyWay").hasClass("active"),i.showConLab=$("#showConLab").hasClass("active");var o=date.T+date.dT;Math.abs(o-stars[0].Tepoch)>.5&&recomputeStarPos(o,stars);var d={timeId:"timeNorth",canvasId:"canvasNorth",projection:"stereographic",centralRa:a,centralDec:.5*Math.PI,angRadius:.5*Math.PI,raGrid:[0,23*t,2*t],decGrid:[-80*e,81*e,20*e],pDraw:i};drawStarChart(d),drawStarChart(d={timeId:"timeCentral",canvasId:"canvasCentral",projection:"Mollweide",centralRa:n,centralDec:0,raGrid:[0,23*t,2*t],decGrid:[-80*e,81*e,20*e],pDraw:i}),drawStarChart(d={timeId:"timeSouth",canvasId:"canvasSouth",projection:"stereographic",centralRa:r,centralDec:-.5*Math.PI,angRadius:.5*Math.PI,raGrid:[0,23*t,2*t],decGrid:[-80*e,81*e,20*e],pDraw:i})}function drawStarChart(t){var e=date.dateString+" "+date.timeString+" UT";$("#"+t.timeId).text(e);var a,n=document.getElementById(t.canvasId),r=n.getContext("2d"),i=n.width,o=n.height;r.clearRect(0,0,i,o),drawChartBoundaryAndGrid(r,n,t),t.pDraw.showEcliptic&&(a=getEclipticNorthPole(date.T+date.dT),r.setLineDash([]),r.strokeStyle="brown",drawCircle(r,a.ra,a.dec,t)),t.pDraw.showMilkyWay&&(drawMilkyWay(r,t),r.setLineDash([]),r.strokeStyle="#ff4dff",drawCircle(r,3.366012906575397,.4734787372451951,t)),drawStars(r,n,t),t.pDraw.showPlanets&&drawPlanets(r,n,t),t.pDraw.showConLab&&drawConstellationLabel(r,t)}function drawChartBoundaryAndGrid(t,e,a){var n,r,i=.465*Math.max(e.width,e.height),o=.5*e.width,d=.5*e.height;a.r=i,a.r2=i*i,a.xc=o,a.yc=d;var s,l,c,h,m,p,u=$("#showPrecession").hasClass("active");if(u){var y=date.T+date.dT;s=precession_matrix(y,-y)}r=180;var f,b=Math.PI/(r-1);for(t.setLineDash([]),w=a.raGrid[0];w<=a.raGrid[1];w+=a.raGrid[2])for(l=w-2*Math.PI*Math.floor(.5*w/Math.PI),Math.abs(l)<.001?t.strokeStyle=a.pDraw.raGridColor[0]:Math.abs(l-.5*Math.PI)<.001?t.strokeStyle=a.pDraw.raGridColor[1]:Math.abs(l-Math.PI)<.001?t.strokeStyle=a.pDraw.raGridColor[2]:Math.abs(l-1.5*Math.PI)<.001?t.strokeStyle=a.pDraw.raGridColor[3]:t.strokeStyle=a.pDraw.raGridColor[4],c=-.5*Math.PI,u&&(l=(f=precessed_ra_dec(l,c,s)).ra,c=f.dec),n=1;n<r;n++)h=w,m=n*b-.5*Math.PI,u&&(h=(f=precessed_ra_dec(h,m,s)).ra,m=f.dec),addLine(t,l,c,h,m,a),l=h,c=m;var v=2*b;for(p=a.decGrid[0];p<=a.decGrid[1];p+=a.decGrid[2])for(c=p,l=0,u&&(l=(f=precessed_ra_dec(l,c,s)).ra,c=f.dec),n=1;n<r;n++)m=p,h=n*v,u&&(h=(f=precessed_ra_dec(h,m,s)).ra,m=f.dec),addLine(t,l,c,h,m,a),l=h,c=m;switch(a.projection){case"stereographic":t.beginPath(),t.setLineDash([]),t.arc(o,d,i,0,2*Math.PI),t.strokeStyle="black",t.stroke();break;case"Mollweide":r=100;var g=2*Math.PI/(r-1);for(t.beginPath(),t.setLineDash([]),t.moveTo(o-i,d),n=1;n<r;n++){var M=n*g-Math.PI,x=o+i*Math.cos(M),S=d-.5*i*Math.sin(M);t.lineTo(x,S)}t.strokeStyle="black",t.stroke()}var C,I,T,w,P=Math.PI/180;if(t.txtAlign="center",t.fillStyle="black",t.font=15..toString()+"px Arial","canvasNorth"==a.canvasId)for(T=-parseFloat($("#rotateNorth").val())*P,w=0;w<24;w+=2)x=o-1.04*i*Math.cos(T),S=d-1.04*i*Math.sin(T)+7.5,C=w.toString()+"h",I=.5*t.measureText(C).width,t.fillText(C,x-I,S),T+=30*P;else if("canvasSouth"==a.canvasId)for(T=-parseFloat($("#rotateSouth").val())*P,w=0;w<24;w+=2)x=o+1.04*i*Math.cos(T),S=d-1.04*i*Math.sin(T)+7.5,C=w.toString()+"h",I=.5*t.measureText(C).width,t.fillText(C,x-I,S),T+=30*P}function drawStars(t,e,a){var n,r;tipsEnabled&&((n=new Array(stars.length)).fill(!0),r="timeNorth"==a.timeId?0:"timeCentral"==a.timeId?1:2,tips[r].length=0);var i=$("#showConLines").hasClass("active");(i||tipsEnabled)&&drawConstellationLinesAndAddTips(t,n,i,r,a);var o,d,s=a.pDraw;t.fillStyle="black";var l=2*Math.PI;for(o=0;o<stars.length;o++){var c=getXY(stars[o].ra,stars[o].dec,a);c.inChart&&stars[o].mag<magLimit&&(d=s.starMagA*stars[o].mag+s.starMagB,d=Math.max(d,1),t.beginPath(),t.arc(c.x,c.y,d,0,l),t.fill(),tipsEnabled&&stars[o].mag<magLimitTip&&n[o]&&(n[o]=!1,d=Math.max(d,3),tips[r].push({x:c.x,y:c.y,r2:d*d,object:"star",starInd:o})))}tipsEnabled&&(n.length=0)}function recomputeStarPos(t,e){var a=e[0].Tepoch,n=t-a;e[0].epoch="",e[0].Tepoch=t;precession_matrix(a,n);for(var r=1;r<e.length;r++){var i=e[r].x+e[r].vx*n,o=e[r].y+e[r].vy*n,d=e[r].z+e[r].vz*n,s=Math.sqrt(i*i+o*o+d*d);e[r].dist2000<99e3&&(e[r].mag=e[r].mag2000+5*Math.LOG10E*Math.log(s/e[r].dist2000)),e[r].x=i,e[r].y=o,e[r].z=d,e[r].ra=Math.atan2(o,i),e[r].dec=Math.asin(d/s)}}function drawConstellationLinesAndAddTips(t,e,a,n,r){t.strokeStyle="#1B9722";var i,o,d=r.pDraw;t.setLineDash([]);for(var s=0;s<conLine.length;s++)$.each(conLine[s],function(s,l){if("name"!=s&&"abbr"!=s){var c,h,m,p,u;h=stars[l[0]].ra,p=stars[l[0]].dec,tipsEnabled&&e[l[0]]&&(u=getXY(h,p,r)).inChart&&(i=l[0],e[i]=!1,o=d.starMagA*stars[i].mag+d.starMagB,o=Math.max(o,3),tips[n].push({x:u.x,y:u.y,r2:o*o,object:"star",starInd:i}));for(var y=1;y<l.length;y++)c=h,m=p,h=stars[l[y]].ra,p=stars[l[y]].dec,a&&addLine(t,c,m,h,p,r),tipsEnabled&&e[l[y]]&&(u=getXY(h,p,r)).inChart&&(i=l[y],e[i]=!1,o=d.starMagA*stars[i].mag+d.starMagB,o=Math.max(o,3),tips[n].push({x:u.x,y:u.y,r2:o*o,object:"star",starInd:i}))}})}function drawCircle(t,e,a,n){for(var r=Math.cos(e)*Math.cos(a),i=Math.sin(e)*Math.cos(a),o=Math.sin(a),d=-i,s=r,l=Math.sqrt(d*d+s*s),c=-(s/=l)*o,h=(d/=l)*o,m=r*s-i*d,p=2*Math.PI/179,u=d,y=s,f=0,b=Math.atan2(y,u),v=Math.asin(f),g=1;g<180;g++){var M=g*p,x=Math.cos(M),S=Math.sin(M);u=x*d+S*c,y=x*s+S*h,f=0*x+S*m;var C=Math.atan2(y,u),I=Math.asin(f);addLine(t,b,v,C,I,n),b=C,v=I}}function drawMilkyWay(t,e){t.setLineDash([]),t.strokeStyle="blue",drawLineInChart(t,milky.northernEdge,e),drawLineInChart(t,milky.southernEdge,e),drawLineInChart(t,milky.betaCas,e),drawLineInChart(t,milky.thetaOph,e),drawLineInChart(t,milky.lambdaSco,e),drawLineInChart(t,milky.coalsack,e)}function drawLineInChart(t,e,a){for(var n=2;n<e.length;n++)addLine(t,e[n-1].ra,e[n-1].dec,e[n].ra,e[n].dec,a)}function drawConstellationLabel(t,e){t.font=12..toString()+"px Arial";for(var a,n,r=1;r<conLab.length;r++)(a=getXY(conLab[r].ra,conLab[r].dec,e)).inChart&&(n=t.measureText(conLab[r].abbr).width,t.fillStyle="white",t.fillRect(a.x,a.y-12,n,12),t.fillStyle="#6c3483",t.fillText(conLab[r].abbr,a.x,a.y)),"ra2"in conLab[r]&&(a=getXY(conLab[r].ra2,conLab[r].dec2,e)).inChart&&(t.fillStyle="white",t.fillRect(a.x,a.y-12,n,12),t.fillStyle="#6c3483",t.fillText(conLab[r].abbr,a.x,a.y))}function drawPlanets(t,e,a){var n;tipsEnabled&&(n="timeNorth"==a.timeId?0:"timeCentral"==a.timeId?1:2);var r=a.pDraw,i=2*Math.PI;t.font="20px Arial";for(var o=0;o<9;o++){var d=getXY(r.planets[o].ra2000,r.planets[o].dec2000,a);if(d.inChart){var s=d.x,l=d.y,c=String.fromCharCode(r.code[o]);if(t.fillStyle=r.color[o],t.fillText(c,s+r.offset[o].x,l+r.offset[o].y),t.beginPath(),t.arc(s,l,r.size[o],0,i),t.fill(),tipsEnabled){var h=.5*t.measureText(c).width;h=Math.max(h,10),tips[n].push({x:s+r.offset[o].x+h,y:l+r.offset[o].y-10,r2:h*h,object:r.pName[o],pIndex:o})}}}}function getXY(t,e,a){switch(a.projection){case"stereographic":return getXYstereographic(t,e,a);case"Mollweide":return getXYmollweide(t,e,a)}}function getXYstereographic_special(t,e,a){var n=t-a.centralRa,r=a.centralDec,i=Math.sin(n),o=Math.cos(n),d=Math.cos(r),s=Math.sin(r),l=Math.cos(e),c=Math.sin(e),h=1+s*c+d*l*o,m=a.r*(d*c-s*l*o)/h,p=a.r*l*i/h,u=m*m+p*p<=a.r2;return{x:a.xc+m,y:a.yc-p,inChart:u}}function getXYstereographic(t,e,a){if(Math.abs(a.angRadius-.5*Math.PI)<1e-5)return getXYstereographic_special(t,e,a);var n=a.centralRa,r=a.centralDec,i=Math.cos(t-n),o=Math.sin(t-n),d=Math.cos(r),s=Math.sin(r),l=Math.cos(e),c=Math.sin(e),h=Math.acos(c*s+l*d*i),m=i*s*l-c*d,p=o*l,u=Math.sqrt(m*m+p*p),y=1,f=0;u>1e-10&&(y=m/u,f=p/u);var b=a.r*Math.tan(.5*h)/Math.tan(.5*a.angRadius);return{x:m=a.xc-b*y,y:p=a.yc-b*f,inChart:b<=a.r}}function getXYmollweide(t,e,a){var n=(t-a.centralRa)/Math.PI;n-=2*Math.floor(.5*(n+1));var r=mollweideThetaSolver(e);return{x:a.xc-a.r*n*Math.cos(r),y:a.yc-.5*a.r*Math.sin(r),inChart:!0,theta:r}}function mollweideThetaSolver(t){if(Math.abs(Math.abs(t)-.5*Math.PI)<1e-10)return t;var e,a=Math.PI*Math.sin(Math.abs(t)),n=2*Math.abs(t),r=0;for(r=0;r<20&&(e=n-(n+Math.sin(n)-a)/(1+Math.cos(n)),!(Math.abs(e-n)<1e-15));r++)n=e;if(20==r)for(var i=0,o=Math.PI,d=0;d<50;d++){var s=(e=.5*(i+o))+Math.sin(e)-a;if(s<0?i=e:o=e,o-i<1e-15||Math.abs(s)<1e-15){r+=d;break}}return t<0&&(e=-e),.5*e}function addLine(t,e,a,n,r,i){var o,d;switch(i.projection){case"stereographic":o=getXYstereographic(e,a,i),d=getXYstereographic(n,r,i),addLineXY(t,o.x,o.y,d.x,d.y,i);break;case"Mollweide":o=getXYmollweide(e,a,i),d=getXYmollweide(n,r,i);var s=i.centralRa-Math.PI,l=(e-s)/Math.PI,c=(n-s)/Math.PI,h=(e-n)/Math.PI;l-=2*Math.floor(.5*(l+1)),c-=2*Math.floor(.5*(c+1)),h-=2*Math.floor(.5*(h+1));var m=Math.abs(l)+Math.abs(c)-Math.abs(h);l*c<0&&m<1e-5?addLinesXYmollweideAcross(t,o,d,i):(t.beginPath(),t.moveTo(o.x,o.y),t.lineTo(d.x,d.y),t.stroke())}}function addLineXY(t,e,a,n,r,i){var o=function(t){return t*t},d=o(e-i.xc)+o(a-i.yc),s=o(n-i.xc)+o(r-i.yc);if(!(d>i.r2&&s>i.r2)){var l=e,c=n,h=a,m=r;if(d>i.r2||s>i.r2){var p,u=(e-i.xc)*(n-i.xc)+(a-i.yc)*(r-i.yc),y=o(e-n)+o(a-r),f=d-u;d<=i.r2?(c=e+(p=(f+Math.sqrt(f*f+y*(i.r2-d)))/y)*(n-e),m=a+p*(r-a)):(l=e+(p=(f-Math.sqrt(f*f+y*(i.r2-d)))/y)*(n-e),h=a+p*(r-a))}t.beginPath(),t.moveTo(l,h),t.lineTo(c,m),t.stroke()}}function addLinesXYmollweideAcross(t,e,a,n){var r=(e.x-n.xc)/n.r,i=(a.x-n.xc)/n.r,o=(e.y-n.yc)/n.r,d=(a.y-n.yc)/n.r;r>0&&(i+=2*Math.cos(a.theta)),r<0&&(i-=2*Math.cos(a.theta));var s=i-r,l=d-o,c=r*s+4*o*l,h=1-r*r-4*o*o,m=h/(c+Math.sqrt(c*c+h*(s*s+4*l*l))),p=r+m*s,u=o+m*l,y=p*n.r+n.xc,f=u*n.r+n.yc;t.beginPath(),t.moveTo(e.x,e.y),t.lineTo(y,f),t.stroke(),y=-p*n.r+n.xc,t.beginPath(),t.moveTo(y,f),t.lineTo(a.x,a.y),t.stroke()}function displayPopup(t,e){var a,n;"canvasNorth"==e?(a=0,n="#tipNorth"):"canvasCentral"==e?(a=1,n="#tipCentral"):(a=2,n="#tipSouth");var r,i,o=document.getElementById(e).getBoundingClientRect(),d=t.clientX-o.left,s=t.clientY-o.top,l=!1;for(r=0;r<tips[a].length;r++){var c=d-(i=tips[a][r]).x,h=s-i.y;if(c*c+h*h<i.r2){l=!0;break}}if(l){$(n+"Text").empty();var m={tipInd:a,tipId:n},p=date.T+date.dT;p>-50&&p<10&&(m.nu=nutation(p)),"star"==i.object?displayPopupStar(i,m):"Sun"==i.object?displayPopupSun(i,m):"Moon"==i.object?displayPopupMoon(i,m):displayPopupPlanet(i,m),$(n).css("left",i.x+3+"px"),$(n).css("top",i.y+3+"px"),$(n).show()}}function closePopup(t){var e="#"+t;$(e).hide(),$(e+"text").empty(),$(e).css("left","-200px")}function displayPopupSun(t,e){var a,n=date.T+date.dT;if(highPrecCalInTips)a=planetGeoVSOP(n,"Sun",!1);else{a=planetPos(n,[!1,!1,!0,!1,!1,!1,!1,!1])[2]}var r=180/Math.PI,i=12/Math.PI,o=constellationAbbrNames()[get_constellation(a.ra2000,a.dec2000)],d=convertDM(a.ra2000*i,"hm"),s=convertDM(a.dec2000*r,"dm"),l=precession_matrix(0,n),c=precessed_ra_dec(a.ra2000,a.dec2000,l);if("nu"in e){c=precessed_ra_dec(c.ra,c.dec,e.nu);var h={T:n,m:e.nu};c=aberration(c.ra,c.dec,h)}var m=convertDM(c.ra*i,"hm"),p=convertDM(c.dec*r,"dm"),u=31.965/a.rGeo,y="<table>";y+='<tr><th colspan="2">Sun</th></tr>',y+="<tr><td>Distance</td> <td>"+a.rGeo.toFixed(3)+" AU</td></tr>",y+="<tr><td>Angular Diameter</td> <td>"+u.toFixed(1)+"'</td></tr>",y+="<tr><td>Ra, Dec (J2000)</td> <td>"+d+", "+s+"</td></tr>",y+="nu"in e?"<tr><td>App. Ra, Dec (of date)</td> <td>"+m+", "+p+"</td></tr>":"<tr><td>Ra, Dec (of date)</td> <td>"+m+", "+p+"</td></tr>",y+="<tr><td>Constellation</td><td>"+o+"</td></tr>",$(e.tipId+"Text").append(y)}function displayPopupMoon(t,e){var a,n,r,i,o,d,s=date.T+date.dT;if(highPrecCalInTips){r=(a=MoonPosElpMpp02(s,!0)).rGeo;d=(n=planetPos(s,[!1,!1,!0,!1,!1,!1,!1,!1])[2]).rGeo,o=n.lam2000,i=a.lam2000}else a=MediumMoon(s),o=(n=MiniSun(s)).lam,d=1,i=a.lam,r=a.rGeo;var l=180/Math.PI,c=12/Math.PI,h=constellationAbbrNames()[get_constellation(a.ra2000,a.dec2000)],m=convertDM(a.ra2000*c,"hm"),p=convertDM(a.dec2000*l,"dm"),u={ra:a.ra,dec:a.dec};if("nu"in e){u=precessed_ra_dec(u.ra,u.dec,e.nu);var y={T:s,m:e.nu};u=aberration(u.ra,u.dec,y)}var f=convertDM(u.ra*c,"hm"),b=convertDM(u.dec*l,"dm"),v=moonIlluminated(n.ra,n.dec,a.ra,a.dec,o,i,r,d),g=v.illuminated.toFixed(2),M=v.phase,x=v.elongTxt,S=v.mag.toFixed(1),C="<table>";C+='<tr><th colspan="2">Moon</th></tr>',C+="<tr><td>Geocentric Distance</td><td>"+r.toFixed(0)+" km ("+(r/6371).toFixed(1)+"R<sub>&oplus;</sub>)</td></tr>",C+="<tr><td>Angular Diameter</td> <td>"+(3475/r*10800/Math.PI).toFixed(1)+"'</td></tr>",C+="<tr><td>Phase</td> <td>"+M+"</td></tr>",C+="<tr><td>Illuminated</td> <td>"+g+"</td> </tr>",C+="<tr><td>Apparent Magnitude</td> <td>"+S+"</td> </tr>",C+="<tr><td>Solar Elongation</td> <td>"+x+"</td> </tr>",C+="<tr><td>Geocentric Ra, Dec (J2000)</td> <td>"+m+", "+p+"</td></tr>",C+="nu"in e?"<tr><td>App. Geocentric Ra, Dec (of date)</td> <td>"+f+", "+b+"</td></tr>":"<tr><td>Geocentric Ra, Dec (of date)</td> <td>"+f+", "+b+"</td></tr>",C+="<tr><td>Constellation</td><td>"+h+"</td></tr>",$(e.tipId+"Text").append(C)}function displayPopupPlanet(t,e){var a=[!1,!1,!0,!1,!1,!1,!1,!1],n=t.pIndex-1;t.pIndex<4&&n--,a[n]=!0;var r,i,o=date.T+date.dT;if(highPrecCalInTips)i={rGeo:(r=planetGeoVSOP(o,t.object,!0)).dSunEarth,lam2000:r.lamSun2000,bet2000:r.betSun2000};else{var d=planetPos(o,a);r=d[n],i=d[2]}var s=r.rHelio,l=r.rGeo,c=180/Math.PI,h=12/Math.PI,m=constellationAbbrNames()[get_constellation(r.ra2000,r.dec2000)],p=convertDM(r.ra2000*h,"hm"),u=convertDM(r.dec2000*c,"dm"),y={ra:r.ra,dec:r.dec};if("nu"in e){y=precessed_ra_dec(y.ra,y.dec,e.nu);var f={T:o,m:e.nu};y=aberration(y.ra,y.dec,f)}var b=convertDM(y.ra*h,"hm"),v=convertDM(y.dec*c,"dm"),g=elongationPhase(r,i),M=g.elongation,x=g.illuminated,S={object:t.object,i:g.phaseAng,rHelio:s,rGeo:l,T:o,planet:r,sun:i},C=planetMag(S),I={Mercury:6.726865375887558,Venus:16.68838398040351,Mars:9.3468517633725,Jupiter:192.78588394427936,Saturn:160.5799887548923,Uranus:69.93800100978119,Neptune:67.89738430970871}[t.object]/l,T="<table>";T+='<tr><th colspan="2">'+t.object+"</th></tr>",T+="<tr><td>Heliocentric Distance</td> <td>"+s.toFixed(3)+" AU</td></tr>",T+="<tr><td>Geocentric Distance</td> <td>"+l.toFixed(3)+" AU</td></tr>",T+="<tr><td>Angular Diameter</td> <td>"+I.toPrecision(3)+'"</td></tr>',T+="<tr> <td>Elongation</td> <td>"+M+"</td></tr>",t.pIndex<5&&(T+="<tr><td>Illuminated</td> <td>"+x+"</td></tr>"),T+="<tr><td>Apparent Magnitude</td> <td>"+C.toFixed(1)+"</td></tr>",T+="<tr><td>Ra, Dec (J2000)</td> <td>"+p+", "+u+"</td></tr>",T+="nu"in e?"<tr><td>App. Ra, Dec (of date)</td> <td>"+b+", "+v+"</td></tr>":"<tr><td>Ra, Dec (of date)</td> <td>"+b+", "+v+"</td></tr>",T+="<tr><td>Constellation</td><td>"+m+"</td></tr>",$(e.tipId+"Text").append(T)}function displayPopupStar(t,e){var a=brightStars(),n=a[t.starInd],r=date.T+date.dT,i=a[0].Tepoch,o=r-i,d=n.x+n.vx*o,s=n.y+n.vy*o,l=n.z+n.vz*o,c=Math.sqrt(d*d+s*s+l*l);if(r>-50&&r<10){var h=planetPos(r,[!1,!1,!0,!1,!1,!1,!1,!1])[2],m=h.rGeo*Math.PI/648e3;d-=-m*Math.cos(h.ra2000)*Math.cos(h.dec2000),s-=-m*Math.sin(h.ra2000)*Math.cos(h.dec2000),l-=-m*Math.sin(h.dec2000),c=Math.sqrt(d*d+s*s+l*l)}var p=180/Math.PI,u=12/Math.PI,y=Math.atan2(s,d),f=Math.asin(l/c),b=convertDM(y*u,"hm"),v=convertDM(f*p,"dm"),g=constellationAbbrNames(),M=g[get_constellation(y,f)],x=g[n.con];M!=x&&(M=x+" (2000), "+M+" ("+date.yyyy+")");var S=precession_matrix(i,o),C=S.p11*d+S.p12*s+S.p13*l,I=S.p21*d+S.p22*s+S.p23*l,T=S.p31*d+S.p32*s+S.p33*l,w=Math.atan2(I,C),P=Math.asin(T/c);if("nu"in e){var A=precessed_ra_dec(w,P,e.nu),D={T:r,m:e.nu};w=(A=aberration(A.ra,A.dec,D)).ra,P=A.dec}var k,L=convertDM(w*u,"hm"),R=convertDM(P*p,"dm"),G="<table>",E=n.name,_=3.2616*c,Y="";k=n.dist2000>=99e3?"?":c.toPrecision(4)+" pc ("+_.toPrecision(4)+" ly)","bayer"in n&&"<"!=E.slice(0,1)&&(E+=", "+n.bayer+" "+n.con);var F=n.mag2000.toFixed(2),N="Mag.",X=0;if(n.dist2000<99e3){var j=n.mag2000+5-5*Math.LOG10E*Math.log(n.dist2000);X=5*Math.LOG10E*Math.log(c/n.dist2000),N+=", Abs. Mag.",F=(F=n.mag2000+X).toFixed(2)+", "+j.toFixed(2)}if("varMax"in n&&"varMin"in n){var U=parseFloat(n.varMax)+X,z=parseFloat(n.varMin)+X;Y=U.toFixed(2)+" &ndash; "+z.toFixed(2)}G+='<tr><th colspan="2">'+E+"</th></tr>",G+="<tr><td>"+N+"</td> <td>"+F+"</td></tr>",""!=Y&&(G+="<tr><td>Variable</td> <td>"+Y+"</td></tr>"),G+="<tr><td>Distance</td> <td>"+k+"</td></tr>","spect"in n&&(G+="<tr><td>Spec, col. ind.</td> <td>"+n.spect,"colorInd"in n&&(G+=", "+n.colorInd),G+="</td></tr>"),G+="<tr><td>Constellation</td> <td>"+M+"</td></tr>",G+="<tr><td>Ra, Dec (J2000)</td> <td>"+b+", "+v+"</td></tr>",G+="nu"in e?"<tr><td>App. Ra, Dec (of date)</td> <td>"+L+", "+R+"</td></tr>":"<tr><td>Ra, Dec (of date)</td> <td>"+L+", "+R+"</td></tr>",G+="</table>",$(e.tipId+"Text").append(G)}function setupDrawingParameters(){var t=-4/6.5;return{color:["red","orange","maroon","#FF00FF","red","brown","brown","#7277e6","#7277e6"],code:[9788,9789,9791,9792,9794,9795,9796,9954,9798],size:[1,2,1,2,2,2,2,2,2],offset:[{x:-10,y:7},{x:-10,y:7},{x:-5,y:7},{x:-7,y:0},{x:-7,y:2},{x:-10,y:7},{x:-5,y:7},{x:-10,y:3},{x:-8,y:5}],pName:["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune"],raGridColor:["#ff8080","#ffcc00","#4d79ff","#ac7339","#cccccc"],starMagA:t,starMagB:4.076923076923077}}function addLegend(t){var e,a,n,r,i=document.getElementById("legend"),o=i.getContext("2d");o.clearRect(0,0,i.width,i.height),o.font="20px Arial",o.fillStyle="black",o.fillText("Magnitude scale:",0,20);var d=2*Math.PI;for(e=-1;e<6;e++){a=t.starMagA*e+t.starMagB,n=180+40*(e+1);var s=-20;-1==e&&(s=-22),o.fillText(e.toString(),n+s,20),o.beginPath(),o.arc(n,15,a,0,d),o.fill()}o.fillText("Planet symbols:   Sun",0,50),o.fillText("Moon",270,50),o.fillText("Mercury",380,50),o.fillText("Venus",160,75),o.fillText("Mars",270,75),o.fillText("Jupiter",380,75),o.fillText("Saturn",160,100),o.fillText("Uranus",270,100),o.fillText("Neptune",380,100),o.fillStyle=t.color[0],n=195,r=50,o.fillText(String.fromCharCode(t.code[0]),n,r),o.beginPath(),o.arc(n-t.offset[0].x,r-t.offset[0].y,t.size[0],0,d),o.fill(),o.fillStyle=t.color[1],n=320,o.fillText(String.fromCharCode(t.code[1]),n,r),o.beginPath(),o.arc(n-t.offset[1].x,r-t.offset[1].y,t.size[1],0,d),o.fill(),o.fillStyle=t.color[2],n=455,o.fillText(String.fromCharCode(t.code[2]),n,r),o.beginPath(),o.arc(n-t.offset[2].x,r-t.offset[2].y,t.size[2],0,d),o.fill(),o.fillStyle=t.color[3],n=220,r=75,o.fillText(String.fromCharCode(t.code[3]),n,r),o.beginPath(),o.arc(n-t.offset[3].x,r-t.offset[3].y,t.size[3],0,d),o.fill(),o.fillStyle=t.color[4],n=320,o.fillText(String.fromCharCode(t.code[4]),n,r),o.beginPath(),o.arc(n-t.offset[4].x,r-t.offset[4].y,t.size[4],0,d),o.fill(),o.fillStyle=t.color[5],n=445,o.fillText(String.fromCharCode(t.code[5]),n,r),o.beginPath(),o.arc(n-t.offset[5].x,r-t.offset[5].y,t.size[5],0,d),o.fill(),o.fillStyle=t.color[6],n=225,r=100,o.fillText(String.fromCharCode(t.code[6]),n,r),o.beginPath(),o.arc(n-t.offset[6].x,r-t.offset[6].y,t.size[6],0,d),o.fill(),o.fillStyle=t.color[7],n=335,o.fillText(String.fromCharCode(t.code[7]),n,r),o.beginPath(),o.arc(n-t.offset[7].x,r-t.offset[7].y,t.size[7],0,d),o.fill(),o.fillStyle=t.color[8],n=460,o.fillText(String.fromCharCode(t.code[8]),n,r),o.beginPath(),o.arc(n-t.offset[8].x,r-t.offset[8].y,t.size[8],0,d),o.fill(),n=0,r=130,o.beginPath(),o.moveTo(n,r),o.lineTo(n+40,r),o.strokeStyle=t.raGridColor[0],o.stroke(),o.font="16px Arial",o.fillStyle="black",o.fillText("Ra = 0h",n+45,r+8),n=120,r=130,o.beginPath(),o.moveTo(n,r),o.lineTo(n+40,r),o.strokeStyle=t.raGridColor[1],o.stroke(),o.font="16px Arial",o.fillStyle="black",o.fillText("Ra = 6h",n+45,r+8),n=240,r=130,o.beginPath(),o.moveTo(n,r),o.lineTo(n+40,r),o.strokeStyle=t.raGridColor[2],o.stroke(),o.font="16px Arial",o.fillStyle="black",o.fillText("Ra = 12h",n+45,r+8),n=370,r=130,o.beginPath(),o.moveTo(n,r),o.lineTo(n+40,r),o.strokeStyle=t.raGridColor[3],o.stroke(),o.font="16px Arial",o.fillStyle="black",o.fillText("Ra = 18h",n+45,r+8)}function displayAnimationSetup(t){var e="#"+t;$("button.menu").attr("disabled",!0),$("button.setupAnimate").attr("disabled",!0),$("button.controlAnimate").attr("disabled",!0),$(e).empty(),$(e).slideDown();var a="<h2>Animation Setup</h2>";$(e).append(a),a='<form name="animSetup" action="" method="get">',a+="<table>",a+='<tr><td colspan="3"><b>Start Time</b></td></tr>',a+='<tr><td>Year: <input type="number" id="yearAnim" step="1" min="-200000" max="200000" /></td>',a+='<td>Month: <input type="number" id="monthAnim" step="1" min="1" max="12" /></td>',a+='<td>Day: <input type="number" id="dayAnim" step="1" min="1" max="31" /></td></tr>',a+='<tr><td>Hour: <input type="number" id="hourAnim" step="1" min="0" max="23" /></td>',a+='<td>Minute: <input type="number" id="minuteAnim" step="1" min="0" max="59" /></td>',a+='<td>Second: <input type="number" id="secondAnim" step="any" min="0" max="60" />UT</td></tr>',a+='<tr><td colspan="3">Choose time step/frame: <input type="radio" id="radioCustom" value="custom" onclick="animRadioClick(',a+="'custom')",a+='" />Custom &nbsp;&nbsp;&nbsp;<input type="radio" id="radioYear" value="year" onclick="animRadioClick(',a+="'year')",a+='" />365.25 days&nbsp;&nbsp;&nbsp;<input type="radio" id="radioCentury" value="century" onclick="animRadioClick(',a+="'century')",a+='" />36525 days (100 years)<br />',a+='<input type="number" id="timeStepAnim" step="any" min="-36525" max="36525" /> days</td></tr>',a+='<tr><td colspan="3">Time between 2 frames: <input type="number" id="frameRateAnim" step="1" min="1" max="1000" /> ms</td></tr>',a+="</table><br />",a+='<p><input type="button" value="Submit" onclick="animationSetup(this.form,',a+="'"+t+"')",a+='" /></p>',a+="</form>",$(e).append(a),a='<div id="animationErrorlocs"></div>',$(e).append(a),a="<p>Note:",a+="<ul>",a+="<li>Time step/frame is the time between two successive frames in the animation.</li>",a+="<li>Time between two frames determines how frequently the star charts will be updated during the animation. It can be as fast as 1 ms, but the charts may not be fast enough to be drawn in 1 ms, depending on the processor speed.</li>",a+="<li>The positions of the Sun, Moon and planets are only accurate for years between -3000 and 3000.</li>",a+="<li>If you choose time step/frame to be 36525 days (1 Julian century), the time soon goes beyond the range in which the positions of the Sun, Moon and planets are accurate. It is better to turn off displaying the Sun, Moon and planets before playing the animation. Note also that the constellation lines will be distorted as stars move away from their current positions as a result of proper motions.</li>",a+="<li>The animation will stop when year goes beyond 200,000 since the formula for the precession becomes inaccurate after that time.",a+="</ul></p>",$(e).append(a),$("#yearAnim").val(date.yyyy),$("#monthAnim").val(date.mm),$("#dayAnim").val(date.dd),$("#hourAnim").val(date.h),$("#minuteAnim").val(date.m),$("#secondAnim").val(date.s.toFixed(3)),$("#timeStepAnim").val(animateDtStep),$("#frameRateAnim").val(frameRate),$("#radioCustom").prop("checked",!1),$("#radioYear").prop("checked",!1),$("#radioDay").prop("checked",!1),Math.abs(animateDtStep-365.25)<1e-10?($("#radioYear").prop("checked",!0),$("#timeStepAnim").val(365.25),$("#timeStepAnim").prop("disabled",!0)):Math.abs(animateDtStep-36525)<.001?($("#radioCentury").prop("checked",!0),$("#timeStepAnim").val(36525),$("#timeStepAnim").prop("disabled",!0)):($("#radioCustom").prop("checked",!0),$("#timeStepAnim").prop("disabled",!1))}function animRadioClick(t){switch($("#radioCustom").prop("checked",!1),$("#radioYear").prop("checked",!1),$("#radioCentury").prop("checked",!1),t){case"custom":$("#radioCustom").prop("checked",!0),$("#timeStepAnim").prop("disabled",!1);break;case"year":$("#radioYear").prop("checked",!0),$("#timeStepAnim").val(365.25),$("#timeStepAnim").prop("disabled",!0);break;case"century":$("#radioCentury").prop("checked",!0),$("#timeStepAnim").val(36525),$("#timeStepAnim").prop("disabled",!0)}}function animationSetup(t,e){var a=parseInt(t.yearAnim.value),n=parseInt(t.monthAnim.value),r=parseInt(t.dayAnim.value),i=parseInt(t.hourAnim.value),o=parseInt(t.minuteAnim.value),d=parseFloat(t.secondAnim.value),s=parseFloat(t.timeStepAnim.value),l=parseInt(t.frameRateAnim.value),c="#animationErrorlocs";$(c).empty();var h=-2e5,m=2e5,p="Invalid year! Please enter an integer between "+h+" and "+m+". Note that 0 means 1 BCE, -1 means 2 BCE and so on. Note that the positions of the Sun, Moon and planets are only accurate for years between -3000 and 3000.";if(sanityCheck(a,"#yearAnim",h,m,p,c),h=1,m=12,p="Invalid month! Month must be an integer between 1 and 12.",sanityCheck(n,"#monthAnim",h,m,p,c),h=1,m=31,p="Invalid day! Day must be an integer between 1 and 31.",sanityCheck(r,"#dayAnim",h,m,p,c),h=0,m=23,p="Invalid hour! Hour must be an integer between 0 and 23.",sanityCheck(i,"#hourAnim",h,m,p,c),h=0,m=59,p="Invalid minute! Minute must be an integer between 0 and 59.",sanityCheck(o,"#minuteAnim",h,m,p,c),h=0,m=60,p="Invalid second! Second must be a number between 0 and 60.",sanityCheck(d,"#secondAnim",h,m,p,c),p="Invalid time step/frame! Please enter a number between "+(h=-36525)+" and "+(m=36525)+".",sanityCheck(s,"#timeStepAnim",h,m,p,c),p="Invalid time between 2 frames! Please enter an integer between "+(h=1)+" and "+(m=1e3)+".",sanityCheck(l,"#frameRateAnim",h,m,p,c),""==$(c).text()){var u="#"+e;$(u).slideUp(),$(u).empty(),$("button.menu").attr("disabled",!1),$("button.setupAnimate").attr("disabled",!1),$("button.controlAnimate").attr("disabled",!1);var y=getDm(a,n,r,0),f=CalDat(y),b=generateTimeString(i,o,d),v=(y+=(i+o/60+d/3600)/24)/36525,g=DeltaT(v);date={yyyy:f.yy,mm:f.mm,dd:f.dd,h:i,m:o,s:d,dateString:f.dateString,timeString:b,D:y,T:v,dT:g},animateDtStep=s,frameRate=l,starCharts()}}function Animate(){var t="#animateNorth",e="#animateCentral",a="#animateSouth";"Play Animation"==$(t).text()?($(t).text("Stop Animation"),$(e).text("Stop Animation"),$(a).text("Stop Animation"),$("button.menu").attr("disabled",!0),$("button.setupAnimate").attr("disabled",!0),$("button.controlAnimate").attr("disabled",!0),$(t).attr("disabled",!1),$(e).attr("disabled",!1),$(a).attr("disabled",!1),tipsEnabled=!1,tips[0].length=0,tips[1].length=0,tips[2].length=0,$(".animationStop").empty(),clearInterval(animate_id),animate_id=setInterval(function(){playAnimation(1)},frameRate)):(clearInterval(animate_id),$(t).text("Play Animation"),$(e).text("Play Animation"),$(a).text("Play Animation"),$("button.menu").attr("disabled",!1),$("button.setupAnimate").attr("disabled",!1),$("button.controlAnimate").attr("disabled",!1),tipsEnabled=!0,starCharts())}function playAnimation(t){var e=t*animateDtStep;date.D+=e,date.T=date.D/36525,date.dT=DeltaT(date.T);var a=CalDat(date.D);date.yyyy=a.yy,date.mm=a.mm,date.dd=a.dd,date.dateString=a.dateString;var n=24*(e-Math.floor(e)),r=date.h+date.m/60+date.s/3600+n;if(r-=24*Math.floor(r/24),date.h=Math.floor(r),date.m=Math.floor(60*(r-date.h)),date.s=3600*(r-date.h-date.m/60),date.timeString=generateTimeString(date.h,date.m,date.s),Math.abs(date.yyyy)>2e5){clearInterval(animate_id);return $("#animateNorth").text("Play Animation"),$("#animateCentral").text("Play Animation"),$("#animateSouth").text("Play Animation"),$("button.menu").attr("disabled",!1),$("button.setupAnimate").attr("disabled",!1),$("button.controlAnimate").attr("disabled",!1),$(".warning").append('<p style="color:red;" class="animationStop">Animation stops since the formula used for precession is only valid between the years -200,000 and 200,000.</p>'),tipsEnabled=!0,void starCharts()}starCharts()}