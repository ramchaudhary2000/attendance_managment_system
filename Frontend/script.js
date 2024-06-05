const trainingAnimation = document.getElementById("training-animation");
const defaultAnimation = document.getElementById("default-animation");
const attendanceAnimation = document.getElementById("attendance-animation");

const form = document.getElementById("form");
const teacher = document.getElementById("teacher");
const notification = document.getElementById("notification");

const errorElm = document.getElementById("err");
const errorClassElm = document.getElementById("err-class");

function setNotification(message, error = false) {
  notification.innerText = message;
  if (error) {
    setTimeout(() => {
      notification.innerText = "Register a new Student or Scan the current one";
    }, 5000);
  }
}

function takeImages() {
  setNotification("Register a new Student or Scan the current one");
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());
  if (formObject.id && formObject.name && formObject.class) {
    console.log("All Fields are correct");
  } else {
    errorElm.style.opacity = "1";
    setTimeout(() => {
      errorElm.style.opacity = "0";
    }, 3000);
    return;
  }

  defaultAnimation.style.display = "none";
  trainingAnimation.style.display = "block";
  attendanceAnimation.style.display = "none";

  setNotification("Taking Images...");

  fetch(
    `http://localhost:5000/take-images?id=${formObject.id}&name=${formObject.name}&classname=${formObject.class}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(res?.error || "Error Occurred");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setNotification(
        `${
          data?.message || "Saved the images but received empty response"
        }, Now Train the Model`
      );
    })
    .catch((e) => {
      console.log("error pakad li", e);
      setNotification(e.message || e.statusText, true);
    })
    .finally(() => {
      defaultAnimation.style.display = "block";
      trainingAnimation.style.display = "none";
      attendanceAnimation.style.display = "none";

      form.reset()
    });
}

function trainImages(e) {
  defaultAnimation.style.display = "none";
  trainingAnimation.style.display = "block";
  attendanceAnimation.style.display = "none";

  setNotification("Training Model...");
  fetch(`http://localhost:5000/train`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res?.error || "Error Occurred");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setNotification(
        `${
          data?.message || "Trained the model but received empty response"
        }, New Student Registered`,
        true
      );
    })
    .catch((e) => {
      console.log("error pakad li", e);
      setNotification(e.message || e.statusText, true);
    })
    .finally(() => {
      defaultAnimation.style.display = "block";
      trainingAnimation.style.display = "none";
      attendanceAnimation.style.display = "none";
    });
}

function takeAttendance() {
  if (teacher.value) {
    defaultAnimation.style.display = "none";
    trainingAnimation.style.display = "none";
    attendanceAnimation.style.display = "block";

    fetch(`http://localhost:5000/track?t=${teacher.value}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res?.error || "Error Occurred");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setNotification(
          `${data?.message || "Taking Attendance"}, Now Train the Model`
        );
      })
      .catch((e) => {
        console.log("error pakad li", e);
        setNotification(e.message || e.statusText, true);
      });
  } else {
    errorClassElm.style.opacity = "1";
    setTimeout(() => {
      errorClassElm.style.opacity = "0";
    }, 3000);
    return;
  }
}
