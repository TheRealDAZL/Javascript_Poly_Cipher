let elementBtnLibrairie = document.getElementById("afficherLibrairie")
let elementLibrairie = document.getElementById("librairie")
let elementMsgUtilisateur =  document.getElementById("messageUtilisateur")
let elementMsgIntrant = document.getElementById("messageIntrant")
let elementCleSub = document.getElementById("cleIntrantSub")
let elementCleTra = document.getElementById("cleIntrantTra")
let elementEncoder = document.getElementById("encoder")
let elementDecoder = document.getElementById("decoder")
let elementResultat = document.getElementById("messageExtrant")
let listeDeMessages = new Liste()
let sensDuChiffrement = elementEncoder.checked
let modifsObjet = false
let afficherLibrairie = true
let infosAffichees = false





listeDeMessages.allerChercherListe()
reinitialiser()

document.getElementById("messageLibrairie").innerHTML = `Instructions :<br>Par défaut, votre message doit absolument faire ` +
    `de 1 à 64 caractères de long.<br>Si vous entrez un message de moins de 64 caractères, le message sera complété<br>` +
    `automatiquement de façon à faire 64 caractères de long.<br><br>Même chose pour ce qui est des clés, cependant si on ` +
    `laisse les champs vides<br>alors les clés sont générées de façon automatique.<br><br>Par défaut, les caractères autorisés pour ` +
    `le message et les deux clés sont :<br>0123456789abcdef<br>ghijklmnopqrstuv<br>wxyzABCDEFGHIJKL<br>MNOPQRSTUVWXYZ .<br><br>Vous pouvez aussi 
     créer votre propre librairie de caractères, cependant<br>votre message et vos clés devront être de la même longueur que votre librairie.`
document.getElementById("afficherInfos").onclick = function () { afficherInfos() }
elementBtnLibrairie.onclick = function () { afficherInstructions() }
elementLibrairie.onfocus = function () { compterCaracteres(elementLibrairie.value.toString().length) }
elementMsgIntrant.onfocus = function() { compterCaracteres(elementMsgIntrant.value.toString().length, true) }
elementCleSub.onfocus = function() { compterCaracteres(elementCleSub.value.toString().length) }
elementCleTra.onfocus = function() { compterCaracteres(elementCleTra.value.toString().length) }
elementLibrairie.oninput = function () {
    modifsObjet = false
    compterCaracteres(elementLibrairie.value.toString().length)
}
elementMsgIntrant.oninput = function() {
    modifsObjet = false
    compterCaracteres(elementMsgIntrant.value.toString().length, true)
    }
elementCleSub.oninput = function() {
    modifsObjet = false
    compterCaracteres(elementCleSub.value.toString().length)
}
elementCleTra.oninput = function() {
    modifsObjet = false
    compterCaracteres(elementCleTra.value.toString().length)
}
elementEncoder.onclick = function () { encoderDecoderRadio(true) }
elementDecoder.onclick = function () { encoderDecoderRadio(false) }
document.getElementById("reinitialiser").onclick = function () {
    reinitialiser()
}
document.getElementById("supprimerTout").onclick = function () {
    // Référence : MDN Web Docs - Window: confirm() method
    // Lien : https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
    if (window.confirm("Voulez-vous vraiment supprimer tous ces objets?")) {
        listeDeMessages.supprimerTousLesMessages()
    }
}
document.onsubmit = (event) => {
    event.preventDefault()

    // MDN Web Docs - Conditional (ternary) operator
    // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    document.getElementById("encoder").checked ? sensDuChiffrement = true : sensDuChiffrement = false

    let objetMessage = new Message(listeDeMessages.messages.length, elementMsgIntrant.value.toString(),
        elementCleSub.value.toString(), elementCleTra.value.toString(), sensDuChiffrement,
        elementLibrairie.value.toString())

    listeDeMessages.traiterObjet(objetMessage)
    modifsObjet = false

    elementMsgUtilisateur.classList.add("invisible", "couleurTexte")

    document.getElementById("messageExtrant").focus()
}



// Méthode qui compte la longueur du string et qui retourne des informations à l'utilisateur
// Cette méthode prend comme argument :
// - un élément qui correspond à un string provenant des données du formulaire;
// - et un message (facultatif) qui correspond à un booléen pour savoir si on évalue le message ou la clé
function compterCaracteres(compteur, message = false) {
    elementMsgUtilisateur.classList.remove("invisible")

    if (compteur < 1) {
        if (message === true) {
            elementMsgUtilisateur.classList.remove("couleurTexte")
            elementMsgUtilisateur.classList.add("erreur")
            elementMsgUtilisateur.textContent = "Vous n'avez pas entré de caractère. Veuillez entrer au moins 1 caractère."
        }
        else {
            elementMsgUtilisateur.classList.add("couleurTexte")
            elementMsgUtilisateur.classList.remove("erreur")
            elementMsgUtilisateur.textContent = "Vous n'avez pas entré de caractère."
        }
    }

    else {
        elementMsgUtilisateur.classList.add("couleurTexte")
        elementMsgUtilisateur.classList.remove("erreur")
        elementMsgUtilisateur.textContent = `Vous avez entré ${compteur} caractère(s).`
    }
}

// Méthode pour échanger le message initial de place avec le résultat, lorsque l'on encode ou lorsque l'on décode
function encoderDecoderRadio(encoder) {
    if (encoder && modifsObjet && !sensDuChiffrement && document.getElementById("messageExtrant").value !== "") {
        let resultat = elementResultat.value

        elementResultat.value = elementMsgIntrant.value
        elementMsgIntrant.value = resultat.toString()
        document.getElementById("messageExtrant").focus()
    }

    else if (!encoder && modifsObjet && sensDuChiffrement && document.getElementById("messageExtrant").value !== "") {
        let resultat = elementResultat.value

        elementResultat.value = elementMsgIntrant.value
        elementMsgIntrant.value = resultat.toString()
        document.getElementById("messageExtrant").focus()
    }

    // MDN Web Docs - Conditional (ternary) operator
    // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    document.getElementById("encoder").checked ? sensDuChiffrement = true : sensDuChiffrement = false
}

// Méthode qui affiche ou qui cache la liste des caratères valides
function afficherInstructions() {
    let messageLibrairie = document.getElementById("messageLibrairie")

    if (!afficherLibrairie) {
        elementBtnLibrairie.textContent = "Cacher les instructions"
        messageLibrairie.classList.remove("invisible")
    }

    else {
        elementBtnLibrairie.textContent = "Afficher les instructions"
        messageLibrairie.classList.add("invisible")
    }

    afficherLibrairie = !afficherLibrairie
}

// Méthode qui développe les cartes
function afficherInfos() {
    if (!infosAffichees) {
        document.querySelectorAll(".card-infos").forEach((e) => { e.classList.remove("invisible") })
        document.getElementById("afficherInfos").textContent = "Cacher toutes les infos"
    }

    else {
        document.querySelectorAll(".card-infos").forEach((e) => { e.classList.add("invisible") })
        document.getElementById("afficherInfos").textContent = "Afficher toutes les infos"
    }

    infosAffichees = !infosAffichees
}

// Méthode qui réinitialise tous les champs
function reinitialiser() {
    elementMsgUtilisateur.classList.add("invisible", "couleurTexte")
    elementLibrairie.value = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ."
    elementMsgIntrant.value = ""
    elementCleSub.value = ""
    elementCleTra.value = ""

    document.getElementById("messageExtrant").value = ""
    document.getElementById("encoder").checked = true
    sensDuChiffrement = true
    modifsObjet = false
    infosAffichees = false
}
