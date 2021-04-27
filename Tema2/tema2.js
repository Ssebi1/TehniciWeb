
addToForm = (label,tag) => {
    var newLabel = document.createElement('label');
    newLabel.innerHTML = label;
    document.getElementsByTagName('form')[0].appendChild(newLabel);

    var newTag = document.createElement(tag);
    if(tag=='select')
    {
        const genders = ['Male','Female','Other'];
        genders.forEach(gender => {
            document.getElementsByTagName('form')[0].appendChild(newTag);
            var option = document.createElement('option');
            option.setAttribute('value',gender);
            option.innerHTML = gender;
            document.getElementsByTagName('select')[0].appendChild(option);
        })
        return
    }
    else if(tag=='radio')
    {
        var radioContainer = document.createElement('div');
        radioContainer.setAttribute('class','radioContainer');
        document.getElementsByTagName('form')[0].appendChild(radioContainer);

        const colors = ['black','red','yellow','orange','blue','pink'];
        colors.forEach(color => {
            var radio = document.createElement('input');
            radio.setAttribute('type','radio');
            radio.setAttribute('value',color);
            radio.setAttribute('name','color');
            document.querySelector('.radioContainer').appendChild(radio);
            document.querySelector('.radioContainer').append(color);
        })
        return
    }    
    document.getElementsByTagName('form')[0].appendChild(newTag);
}

window.addEventListener('load',()=>{
    // Form tags
    let tag = document.createElement('form');
    tag.setAttribute('class','form');
    document.getElementsByTagName('body')[0].appendChild(tag);

    // First Name input
    addToForm('First name','input');

    // Last Name input
    addToForm('Last name','input');

    const inputs = document.getElementsByTagName('input')
    let inputsCompleted = false;
    let inputAdded = false;

    window.setTimeout(() => {
        if(!inputAdded)
        {
            location.reload();
            window.alert('Sesiunea a expirat');
        }
    },100000)

    for(let i=0;i<inputs.length;i++)
        inputs[i].addEventListener('focusout',()=>{
            if(!inputsCompleted && inputs[i].value!='')
                inputAdded = true;
            if(!inputsCompleted && inputs[0].value!='' && inputs[1].value!='')
            {
                inputsCompleted = true;
                // Gender Select
                addToForm('Gender','select');
                let selectCompleted = false;
                document.getElementsByTagName('select')[0].addEventListener('change',()=>{
                    if(!selectCompleted)
                        {
                            selectCompleted = true;
                            // Colors Radio
                            addToForm('Favourite color','radio');
                            const radios = document.querySelectorAll('input[type="radio"]');
                            
                            let radioCompleted = false;
                            for(let j=0;j<radios.length;j++)
                            {
                                radios[j].addEventListener('change',() => {
                                    if(!radioCompleted)
                                    {
                                        radioCompleted = true
                                        // Submit button
                                        let button = document.createElement('button');
                                        button.innerHTML = 'Submit';
                                        document.getElementsByTagName('form')[0].appendChild(button);

                                        document.getElementsByTagName('button')[0].addEventListener('click',(event) => {
                                            event.preventDefault();
                                            const firstName = document.getElementsByTagName('input')[0].value;
                                            const lastName = document.getElementsByTagName('input')[1].value;
                                            const gender = document.getElementsByTagName('select')[0].value;
                                            let color = '';
                                            for(let k=0;k<radios.length;k++)
                                            {
                                                if(radios[k].checked)
                                                    {
                                                        color = radios[k].value;
                                                        break;
                                                    }
                                            }
                                            document.querySelector('body').innerHTML = 'First name: ' + firstName + '<br>' + 'Last name: ' + lastName + '<br>' + 'Gender: ' + gender + '<br>' + 'Favourite color: ' + color + '<br>';
                                            document.querySelector('body').style.textAlign='center';
                                        })
                                    }
                                })
                            }
                        }
                })
            }
        })
})

