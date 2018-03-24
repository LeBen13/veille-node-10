let oBtnAjouter = document.getElementById('ajouter')
oBtnAjouter.addEventListener('click', () => {
    xhr = new XMLHttpRequest();
    xhr.open('POST', "ajouter_ajax", true);

    data = {
        "nom": "",
        "prenom": "",
        "telephone": "",
        "courriel": ""
    }

    sData = JSON.stringify(data);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(sData);
    xhr.addEventListener("readystatechange", traiterRequest, false);
})


function traiterRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let oNouvMembre = JSON.parse(xhr.responseText);


        let aMembre = [oNouvMembre['_id'], oNouvMembre['prenom'], oNouvMembre['nom'], oNouvMembre['telephone'], oNouvMembre['courriel']];
        let oTab = document.getElementsByClassName('tableau')[0];


        let oTr = document.createElement("tr");

        for (elm of aMembre) {
            let oTd = document.createElement("td");
            oTd.innerHTML = elm;
            if (aMembre.indexOf(elm) != 0) {
                oTd.setAttribute('contenteditable', true);
            }
            oTr.appendChild(oTd);
        }
        oTr.innerHTML += "<td><a href='#'' class='modifier'> <%= __('modifier') %></a></td><td><a class='supprimer' ><%= __('supprimer') %></a></td>";

        oTr.style.backgroundColor = '#62bdce';


        oTab.children[0].appendChild(oTr);

        modifier();
        supprimer();


    }
}
