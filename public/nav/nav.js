

function openNav(x) {
	x.classList.toggle('change');
	var sidebar = document.getElementById('mySidebar');
	sidebar.style.width = window.getComputedStyle(sidebar).width === '0px' ? '300px' : '0px';
}

function Sidedrop(x) {
	x.classList.toggle('drop');
}

const sideNotifButton=document.querySelector('#sideNotif');
const sidebarMenu=document.querySelector('.sidebar-menu');
const sidebarNotif=document.querySelector('.sidebar .drop-content');
const sideMenuButton=document.querySelector('#sideMenu');
sideNotifButton.addEventListener('click',(e)=>{
    e.preventDefault();
    sidebarMenu.style.display='none';
    sidebarNotif.style.display='block';
});
sideMenuButton.addEventListener('click',(e)=>{
    e.preventDefault();
    sidebarMenu.style.display='block';
    sidebarNotif.style.display='none';
});


const clearAll=document.querySelector('.clearAll');
const notifCount=document.querySelectorAll('.counter');
// clearAll.addEventListener('click',()=>{
//         axios.delete('/api/notifications/delete')
//         .then((response)=>{
//             document.querySelector('#nav_notif').innerHTML='';
//             notifCount[0].innerHTML='0'
//             notifCount[1].innerHTML='0'

//         })
//         .catch(err=>{
//             console.log(err.message);
//         })
// });