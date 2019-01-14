

function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            
            document.getElementById("createProfile").style.display = "block";
            document.getElementById("signUp").style.display = "none";

        })
        .catch(function (error) {

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');

            } else if (errorCode == 'auth/email-already-in-use') {
                alert('This email is already in use. Please select a different one.');

            } else {
                alert(errorMessage);

            }
            console.log(error);
        });

}

function signin() {
    let email = document.getElementById("emailSignIn").value;
    let password = document.getElementById("passwordSignIn").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        console.log("signed in");
        document.getElementById("signout").style.display = "block";
        document.getElementById("landingPage").style.display = "block";
        document.getElementById("signIn").style.display = "none";
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password') {
            alert('Incorrect email or password. Please try again.');
        } else {
            alert(errorMessage);

        }
        console.log(error);
    });
}

function signout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("signed out");
    }).catch(function (error) {
        // An error happened.
    });
}

function createProfile() {
    let first = document.getElementById("firstName").value;
    let last = document.getElementById("lastName").value;
    let birthday = document.getElementById("birthday").value;
    let bio = document.getElementById("bio").value;

    var user = firebase.auth().currentUser;

    if (first != "" && last != "" && birthday != "" && bio != "") {
        firebase.database().ref("users/" + user.uid).set({
            uid: user.uid,
            first_name: first,
            last_name: last,
            birthday: birthday,
            bio: bio,
            in_session: true
        }).then(() => {
            document.getElementById("createProfile").style.display = "none";
            document.getElementById("landingPage").style.display = "block";
        });
    } else {
        alert("Please fill out all inputs.");
    }
}

function updateTextInput(val) {
    document.getElementById('textInput').value = val * 30;
}

function getNeedsInfo() {
    
    
    
    
    let user = firebase.auth().currentUser;
    var name = "";
    firebase.database().ref("users/" + user.uid).on('value', function (snapshot) {
        name = (snapshot.val() && (snapshot.val().first_name + " " + snapshot.val().last_name)) || 'Anonymous';
    
        let address = document.getElementById("address").value;
        let jobs = document.getElementsByClassName("job");

        let jobList = [];

        for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].checked && jobs[i].name == "other") {
                jobList.push(document.getElementById("other").value);
            } else if (jobs[i].checked) {
                jobList.push(jobs[i].name);
            }
        }

        let duration = document.getElementById("textInput").value;

        if (address != "" && jobList.length != 0 && duration != "") {
            firebase.database().ref("/jobs/").push({
                full_name: name,
                jobs: jobList,
                address: address,
                duration: duration
            });
        } else {
            alert("Please fill out all inputs.");
        }
    });

}

function showJob() {
    
    //if (document.getElementById("createProfile").style.display = "none") {
    //document.getElementById("need").style.display = "none";
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("offerAssistance").style.display = "block";
    loadJobs();
    //}
}

// Loads chat message history and listens for upcoming ones.
function loadJobs() {
    // Loads the last 12 messages and listens for new ones.
    var callback = function (job) {
        console.log(job.val())
        // var data = snap.val();
        // displayMessage(snap.key, data.name, data.text, data.profilePicUrl, data.imageUrl);
    };

    firebase.database().ref('/jobs/').on('child_added', callback);
    firebase.database().ref('/jobs/').on('child_changed', callback);
}

function showSignUp(){
    document.getElementById("signUp").style.display = "block";
    document.getElementById("signIn").style.display = "none";
}

function createJob(){
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("need").style.display = "block";
}



