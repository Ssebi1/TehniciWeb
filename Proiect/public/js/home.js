const DOM = {
    'exerciseItems': document.querySelectorAll('.exercises-item'),
    'viewMoreButton': document.querySelector('.exercises-view-more'),
    'exerciseSaveIcon': document.querySelectorAll('.exercise-save'),
    'exerciseSaveButton': document.querySelectorAll('.exercise-save-button'),
    'subscribeInput': document.querySelector('.showcase-button input'),
    'form': document.querySelector('#subscribe-form'),
    'alert': document.querySelector('.alert'),
    'year': document.querySelector('.year')
}


const setFooterDate = (function (){
    let d = new Date()
    DOM['year'].innerHTML = d.getFullYear()
})();


const viewMoreFunctinality = (function (){
    if(!localStorage.hasOwnProperty('viewMoreState'))
        localStorage.setItem('viewMoreState',0);

    let exercisesViewMore = () =>{
        DOM['exerciseItems'].forEach( (el) =>{
            el.style.display = 'initial';
        });
        localStorage.setItem('viewMoreState',1);
        DOM['viewMoreButton'].innerHTML = 'View less <i class="fas fa-chevron-up"></i>';
    }

    let exercisesViewLess = () =>{
        for(let i=6;i<DOM['exerciseItems'].length;i++)
            DOM['exerciseItems'][i].style.display="none";
        localStorage.setItem('viewMoreState',0);
        DOM['viewMoreButton'].innerHTML = 'View more <i class="fas fa-chevron-down"></i>';
    }

    localStorage.getItem('viewMoreState') == 0 ? exercisesViewLess() : exercisesViewMore();

    DOM['viewMoreButton'].addEventListener('click',() => {
        localStorage.getItem('viewMoreState') == 0 ? exercisesViewMore() : exercisesViewLess();
    });
})();

const exerciseSaveFunctionality = (function (){
    let clickable = true;
    for(let i=0;i<DOM['exerciseSaveButton'].length;i++)
    {
        DOM['exerciseSaveButton'][i].addEventListener('click',() => {
            
            if(clickable)
            {
                if(DOM['exerciseSaveButton'][i].dataset.selected == 'false')
                {
                    DOM['exerciseSaveButton'][i].innerHTML = '';
                    let textNode = document.createElement('i')
                    textNode.className = 'fas fa-star exercise-save'
                    DOM['exerciseSaveButton'][i].appendChild(textNode);
                    DOM['exerciseSaveButton'][i].dataset.selected = 'true'
                }
                else
                {
                    DOM['exerciseSaveButton'][i].innerHTML = '';
                    let textNode = document.createElement('i')
                    textNode.className = 'far fa-star exercise-save'
                    DOM['exerciseSaveButton'][i].appendChild(textNode);
                    DOM['exerciseSaveButton'][i].dataset.selected = 'false'
                }
                
                DOM['exerciseSaveButton'][i].style.opacity = '1';
                clickable = false
                setTimeout(() => {
                    window.location.href ='/save?id=';
                },1000)
            }
            
            
        })
    }
    
})();

DOM['form'].addEventListener('submit',(e) =>{
    e.preventDefault();
    let email = DOM['subscribeInput'].value;
    let validation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    if(!validation)
        {
            DOM['subscribeInput'].value='';
            alert('Email format is not correct');
        }
    else
        {
            DOM['form'].style.display='none';
        }
        
})

DOM['subscribeInput'].addEventListener('keydown',(e) => {
    if(e.keyCode == 40)
    {
        e.preventDefault()
        let email = DOM['subscribeInput'].value.slice(0,-1);
        DOM['subscribeInput'].value = email;
    }
})


const alertTransition = () =>{
    if(DOM['alert'].style.display == 'none')
    {
        DOM['alert'].style.display= 'block';
        setTimeout(()=>{
            DOM['alert'].style.bottom = '20px';
        },500)
    }
    else
    {
        DOM['alert'].style.bottom = '-50px';
        setTimeout(()=>{
            DOM['alert'].style.display= 'none';
        },500)
    }
}

function randomTime() {
    return Math.floor(Math.random() * (25000-15000) + 15000);
}

DOM['alert'].addEventListener('click',alertTransition);
setInterval(() => {
    alertTransition();
},randomTime())





