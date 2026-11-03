/* Assignment 6 — jQuery-only interaction. All cases query the generated DOM. */
'use strict';
const COLORS={red:'#d94e5b',blue:'#3c7bdb',green:'#358b63',black:'#303743',yellow:'#e8a521',purple:'#925ac8'};
const ICONS={phone:'📱',glasses:'👓',bag:'👜',cup:'☕',crumbs:'🍰'};
const ROOM_INFO=[{id:'balcony',name:'Balcony',floor:2},{id:'hall',name:'Hall',floor:2},{id:'kitchen',name:'Kitchen',floor:1},{id:'living',name:'Living room',floor:1}];
// Data copied left-to-right from the illustration on page 2 of the assignment.
const ORIGINAL={
 balcony:[['Aigerim','green','20:45',0,'cup crumbs'],['Aliya','yellow','21:15',0,'phone cup'],['Madina','green','22:10',0,'phone bag crumbs'],['Ivan','black','20:10',1,'cup']],
 hall:[['Arman','yellow','20:35',0,'bag glasses'],['Sophia','purple','21:20',1,'phone'],['Dias','green','19:45',1,''],['Bekzat','purple','20:55',0,'bag cup crumbs'],['Aruzhan','blue','21:50',1,'phone'],['Saule','green','21:25',0,'glasses']],
 kitchen:[['Nurlan','red','19:40',1,'phone cup'],['Emma','black','20:15',0,'bag'],['Timur','green','21:05',1,'phone bag crumbs'],['Sergey','yellow','20:50',0,''],['Yerlan','red','21:40',1,'glasses phone'],['Kamila','green','20:05',0,'cup']],
 living:[['Daniel','blue','19:55',1,'glasses'],['Zarina','green','21:10',0,'bag phone crumbs'],['Natasha','yellow','20:30',1,''],['Askar','black','21:00',1,'phone'],['Inkar','purple','20:20',0,'bag']]
};
const CASES=[
'Who is in the hall?','Who wears yellow or purple?','Which AITU students are upstairs?','Who has glasses or a bag?',
'Who has nothing?','Who has a phone but no bag?','Who came between 20:30 and 21:00?','Who came after 21:00 and is not AITU?',
'Who stands next to Askar?','Who is last in every room?','Who is third in each room?','Who stands after Timur?',
'Who stands before someone in black?','Which room contains Aruzhan?','Rooms with fewer than 6 guests?',
'Rooms with a cup but no glasses?','Who arrived first in every room?','Miras joins between Askar and Inkar','Natasha leaves the party','Who stole the cake?'
];
const DETAILS=[
'Every person standing in the hall.','Yellow or purple clothing.','AITU badges on floor 2.','Guests carrying glasses or a bag.',
'Guests with no belongings.','Phone present and bag absent.','Arrival from 20:30 through 21:00.','Arrived after 21:00 without AITU badge.',
'Immediate neighbors of Askar.','Last guest in each of four rooms.','Third guest in each room.','Everyone following Timur in the kitchen.',
'Immediate left neighbor of a black-clothed guest.','Room that contains Aruzhan.','Rooms with fewer than six guests.',
'Rooms with at least one cup and zero glasses.','Earliest arrival in each room.','Insert Miras after Askar with fadeIn().',
'Remove Natasha with fadeOut().','Downstairs, 21:00–21:30, crumbs, no cup, next to AITU.'
];
let rooms, currentGuest=null, busy=false, modalBusy=false, activeCase=0, sortBusy=false;
const roomName=id=>ROOM_INFO.find(x=>x.id===id).name;
const guestFromTuple=(a,room)=>({name:a[0],color:a[1],time:a[2],aitu:!!a[3],things:a[4]?a[4].split(' '):[],room});
function resetData(){rooms=Object.fromEntries(ROOM_INFO.map(r=>[r.id,ORIGINAL[r.id].map(a=>guestFromTuple(a,r.id))]));}
function modelGuest(name){for(const r of ROOM_INFO){const g=rooms[r.id].find(p=>p.name===name);if(g)return g;}return null;}
function escapeAttr(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function avatar(name){return `avatars/${encodeURIComponent(name)}.svg`;}
function guestMarkup(g){const classes=['guest',`color-${g.color}`,g.aitu?'aitu':'non-aitu',...g.things.map(t=>'has-'+t)].join(' ');return `<div tabindex="0" role="button" aria-label="View ${escapeAttr(g.name)}" class="${classes}" data-name="${escapeAttr(g.name)}" data-time="${g.time}" data-minutes="${toMinutes(g.time)}" data-color="${g.color}" data-aitu="${g.aitu}" data-things="${g.things.join(' ')}" style="--cloth:${COLORS[g.color]}"><span class="avatar-ring"><img alt="${escapeAttr(g.name)} avatar" src="${avatar(g.name)}" loading="lazy">${g.aitu?'<span class="cap">🎓</span>':''}</span><span class="guest-name">${escapeAttr(g.name)}</span><span class="guest-time">◷ ${g.time}</span><span class="thing-list">${g.things.length?g.things.map(t=>`<span class="thing" title="${t}">${ICONS[t]}</span>`).join(''):'<span class="none">—</span>'}</span></div>`;}
const toMinutes=t=>+t.slice(0,2)*60 + +t.slice(3,5);
function build(){
 $('#floors').html([2,1].map(n=>`<div class="floor" data-floor="${n}"><div class="floor-tag">FLOOR ${n}</div>${ROOM_INFO.filter(r=>r.floor===n).map(r=>`<article class="room" data-room="${r.id}" data-floor="${n}"><div class="room-head"><h2>${r.name}</h2><button class="sort-button" data-room="${r.id}" title="Toggle time order">Sort by time ↕</button></div><div class="guest-list">${rooms[r.id].map(guestMarkup).join('')}</div></article>`).join('')}</div>`).join(''));
}
// IMPORTANT: all 20 selector solutions start from the page, never from the array.
function queryCase(n){switch(n){
 case 1:return $('.room[data-room="hall"] .guest');
 case 2:return $('.guest.color-yellow, .guest.color-purple');
 case 3:return $('.floor[data-floor="2"] .guest.aitu');
 case 4:return $('.guest.has-glasses, .guest.has-bag');
 case 5:return $('.guest:not([data-things~="phone"]):not([data-things~="glasses"]):not([data-things~="bag"]):not([data-things~="cup"]):not([data-things~="crumbs"])');
 case 6:return $('.guest.has-phone:not(.has-bag)');
 case 7:return $('.guest').filter(function(){let t=+$(this).attr('data-minutes');return t>=1230&&t<=1260;});
 case 8:return $('.guest.non-aitu').filter(function(){return +$(this).attr('data-minutes')>1260;});
 case 9:return $('.guest[data-name="Askar"]').prev('.guest').add($('.guest[data-name="Askar"]').next('.guest'));
 case 10:return $('.room .guest:last-child');
 case 11:return $('.room .guest:nth-child(3)');
 case 12:return $('.guest[data-name="Timur"]').nextAll('.guest');
 case 13:return $('.guest.color-black').prev('.guest');
 case 14:return $('.guest[data-name="Aruzhan"]').closest('.room');
 case 15:return $('.room').filter(function(){return $(this).find('.guest').length<6;});
 case 16:return $('.room:has(.guest.has-cup)').filter(function(){return $(this).find('.guest.has-glasses').length===0;});
 case 17:return $('.room .guest').filter(function(){return +$(this).attr('data-minutes') === Math.min(...$(this).closest('.room').find('.guest').map(function(){return +$(this).attr('data-minutes');}).get());});
 case 18:return $('.guest[data-name="Miras"]');
 case 19:return $('.guest[data-name="Natasha"]');
 case 20:return $('.floor[data-floor="1"] .guest.has-crumbs:not(.has-cup)').filter(function(){let t=+$(this).attr('data-minutes');return t>1260&&t<1290&&($(this).prev('.guest').hasClass('aitu')||$(this).next('.guest').hasClass('aitu'));});
 default:return $();}}
function showResult(n,$found,action){const isRooms=n>=14&&n<=16;const items=$found.map(function(){return isRooms?$(this).find('h2').first().text():$(this).attr('data-name');}).get();$('#result').html(`<strong>Case ${n} · ${action||items.length+' match'+(items.length===1?'':'es')}</strong><span>${items.length?items.map(escapeAttr).join(', '):'No matches'}</span>`);}
function spotlight($found){const $guests=$found.filter('.guest').add($found.filter('.room').find('.guest'));$('.guest').stop(true,true).fadeTo(300,.2);$guests.stop(true,true).fadeTo(300,1);$found.addClass('is-found');$guests.addClass('is-found');}
function jump($found){const $targets=$found.filter('.guest').add($found.filter('.room').find('.guest'));$targets.each(function(){const $x=$(this);$x.stop(true,true).css('top',0).animate({top:-13},145).animate({top:0},175);});}
function clearSelection(){activeCase=0;$('.case').removeClass('active');$('.is-found').removeClass('is-found');$('.guest').stop(true,true).css('top',0).fadeTo(200,1);$('#result').html('<strong>Ready</strong><span>All guests visible. Choose another case.</span>');}
function runCase(n){if(busy||sortBusy||modalBusy)return;closeDialog(true);activeCase=n;$('.case').removeClass('active');$(`.case[data-case="${n}"]`).addClass('active');
 if(n===18){build();const already=!!modelGuest('Miras');if(!already){const g={name:'Miras',color:'blue',time:'21:20',aitu:true,things:['phone'],room:'living'};const i=rooms.living.findIndex(x=>x.name==='Askar');rooms.living.splice(i+1,0,g);$(guestMarkup(g)).hide().insertAfter($('.guest[data-name="Askar"]')).fadeIn(550);}
 const $found=queryCase(n);spotlight($found);jump($found);showResult(n,$found,already?'Already joined':'Miras joined');return;}
 if(n===19){build();const $found=queryCase(n);showResult(n,$found,'Natasha left');if(!$found.length)return;busy=true;$found.stop(true,true).fadeOut(550,function(){const idx=rooms.living.findIndex(g=>g.name==='Natasha');if(idx>=0)rooms.living.splice(idx,1);$(this).remove();busy=false;});return;}
 build();const $found=queryCase(n);spotlight($found);jump($found);showResult(n,$found);
}
function detailsText(g){return `<div class="dialog-top" style="--cloth:${COLORS[g.color]}"><img class="dialog-avatar" src="${avatar(g.name)}" alt=""><div><h3>${escapeAttr(g.name)}</h3><p>${roomName(g.room)} · Floor ${ROOM_INFO.find(r=>r.id===g.room).floor}</p></div></div><div class="dialog-details"><p>🕒 Came at <b>${g.time}</b></p><p>👕 Wearing <b>${g.color}</b></p><p>🎓 <b>${g.aitu?'AITU student':'Not an AITU student'}</b></p><p>🎒 ${g.things.length?'Has '+g.things.join(', '):'Came with nothing'}</p></div><div class="dialog-moves">${ROOM_INFO.filter(r=>r.id!==g.room).map(r=>`<button data-move="${r.id}">Move to ${r.name}</button>`).join('')}</div><div class="dialog-foot">Click outside or press Esc to close</div>`;}
function guestRect($g){const r=$g.find('.avatar-ring')[0].getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height};}
function dialogTarget(){let w=Math.min(385,window.innerWidth-28),h=$('#guestDialog').data('fullheight')||310;return {left:Math.max(14,(window.innerWidth-w)/2),top:Math.max(14,(window.innerHeight-h)/2),width:w,height:h};}
function openDialog(name){if(busy||sortBusy)return;const g=modelGuest(name);if(!g)return;closeDialog(true);currentGuest=name;const $source=$(`.guest[data-name="${name}"]`),from=guestRect($source),$dialog=$('#guestDialog');$dialog.stop(true,true).html(detailsText(g)).css({...from,opacity:.65,padding:0,display:'block'});$('#modalShade').stop(true,true).fadeIn(140);$dialog.css({width:Math.min(385,window.innerWidth-28),height:'auto',padding:'22px',visibility:'hidden'});const h=$dialog.outerHeight();$dialog.data('fullheight',h).css({...from,padding:0,visibility:'visible'}).animate({...dialogTarget(),opacity:1},270,function(){$dialog.css('padding','22px');});}
function closeDialog(immediate=false){if(!currentGuest){$('#guestDialog,#modalShade').stop(true,true).hide();return;}const old=currentGuest;currentGuest=null;const $d=$('#guestDialog');$d.stop(true,true);$('#modalShade').stop(true,true).fadeOut(immediate?0:130);if(immediate){$d.hide();return;}const $g=$(`.guest[data-name="${old}"]`);if(!$g.length){$d.hide();return;}const r=guestRect($g);$d.css('padding',0).animate({...r,opacity:.35},220,function(){$d.hide();});}
function synchronizeModel(source,destination,name){const idx=rooms[source].findIndex(g=>g.name===name);if(idx<0)return;const [g]=rooms[source].splice(idx,1);g.room=destination;rooms[destination].push(g);}
function moveGuest(name,destination){if(busy||sortBusy)return;const $card=$(`.guest[data-name="${name}"]`);if(!$card.length)return;const source=$card.closest('.room').attr('data-room');if(source===destination)return;busy=true;closeDialog(true);clearSelection();const $list=$(`.room[data-room="${destination}"] .guest-list`),old=$card.offset(),width=$card.outerWidth(),height=$card.outerHeight();const $ghost=$card.clone().removeAttr('id').addClass('flight-ghost').css({left:old.left,top:old.top,width,height,margin:0,opacity:1});$('body').append($ghost);const $slot=$('<div class="flying-slot"></div>').css({width:0,opacity:0}).appendTo($list);const $srcSlot=$('<div class="flying-slot"></div>').css({width,height}).insertBefore($card);$card.detach();$srcSlot.animate({width:0,opacity:0},360,function(){$srcSlot.remove();});$slot.animate({width:Math.max(40,width),opacity:1},350);const destinationPosition=$slot.offset();$ghost.stop(true,true).animate({left:destinationPosition.left,top:destinationPosition.top},620,'swing',function(){synchronizeModel(source,destination,name);$slot.replaceWith($card);$ghost.remove();busy=false;});}
// FLIP animation with temporary clones: jQuery animate() handles every intermediate frame.
function sortRoom(id){if(busy)return;const $list=$(`.room[data-room="${id}"] .guest-list`);const $room=$list.closest('.room');const currentSorted=$room.attr('data-sorted')==='true';const sorted=!currentSorted;const $cards=$list.children('.guest');if(!$cards.length)return;
 // Finish any previous sort before beginning a new one; prevents queued animations.
 $('.sort-ghost').stop(true,true).remove();$('.room.sorting').removeClass('sorting');
 const first={};$cards.each(function(){first[$(this).attr('data-name')]=$(this).offset();});
 let desired=sorted?[...rooms[id]].sort((a,b)=>toMinutes(a.time)-toMinutes(b.time)):[...rooms[id]].sort((a,b)=>ORIGINAL[id].findIndex(x=>x[0]===a.name)-ORIGINAL[id].findIndex(x=>x[0]===b.name));
 // Guests who joined mid-party are appended in original-order mode.
 desired=desired.sort((a,b)=>sorted?toMinutes(a.time)-toMinutes(b.time):((ORIGINAL[id].findIndex(x=>x[0]===a.name)<0?999:ORIGINAL[id].findIndex(x=>x[0]===a.name))-(ORIGINAL[id].findIndex(x=>x[0]===b.name)<0?999:ORIGINAL[id].findIndex(x=>x[0]===b.name))));
 desired.forEach(g=>$list.append($cards.filter(`[data-name="${g.name}"]`)));
 rooms[id]=desired;$room.attr('data-sorted',String(sorted));const targets={};$list.children('.guest').each(function(){targets[$(this).attr('data-name')]=$(this).offset();});
 $room.addClass('sorting');let remaining=desired.length;desired.forEach(g=>{const $item=$list.children(`.guest[data-name="${g.name}"]`);const o=first[g.name],t=targets[g.name];const $clone=$item.clone().removeAttr('id').addClass('sort-ghost').css({left:o.left,top:o.top,width:$item.outerWidth(),height:$item.outerHeight(),margin:0});$('body').append($clone);$clone.animate({left:t.left,top:t.top},420,'swing',function(){$clone.remove();if(!--remaining)$room.removeClass('sorting');});});}
$(function(){resetData();$('#cases').html(CASES.map((label,i)=>`<button class="case" data-case="${i+1}" title="${DETAILS[i]}"><span class="num">${String(i+1).padStart(2,'0')}</span><span class="case-title">${label}</span></button>`).join(''));build();
 $('#cases').on('click','.case',function(){runCase(+$(this).attr('data-case'));});$('#clear').on('click',clearSelection);$('#reset').on('click',function(){closeDialog(true);$('.sort-ghost,.flight-ghost').stop(true,true).remove();resetData();build();clearSelection();});
 $('#house').on('click','.guest',function(){openDialog($(this).attr('data-name'));}).on('keydown','.guest',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openDialog($(this).attr('data-name'));}}).on('click','.sort-button',function(){sortRoom($(this).attr('data-room'));});
 $('#guestDialog').on('click','[data-move]',function(){if(currentGuest)moveGuest(currentGuest,$(this).attr('data-move'));});$(document).on('mousedown',e=>{if(currentGuest&&!$(e.target).closest('#guestDialog,.guest').length)closeDialog();}).on('keydown',e=>{if(e.key==='Escape')closeDialog();});
});
