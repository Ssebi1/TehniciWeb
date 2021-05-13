const DOM = {
    'exerciseItems': document.querySelectorAll('.exercises-item'),
    'viewMoreButton': document.querySelector('.exercises-view-more'),
    'exerciseSaveButton': document.querySelectorAll('.exercise-save')
}

const viewMoreFunctinality = (function (){
    if(!localStorage.hasOwnProperty('viewMoreState'))
        localStorage.setItem('viewMoreState',0);

    let exercisesViewMore = () =>{
        for(let i=6;i<DOM['exerciseItems'].length;i++)
            DOM['exerciseItems'][i].style.display="initial";
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
    for(let i=0;i<DOM['exerciseSaveButton'].length;i++)
    {
        DOM['exerciseSaveButton'][i].addEventListener('click',() => {
            console.log('clicked');
        })
    }
    
})();



