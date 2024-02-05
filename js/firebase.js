import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCp91vr2H9bR9k3Fs5s8582O2hSqFbjamU",
  authDomain: "centroemmapw.firebaseapp.com",
  projectId: "centroemmapw",
  storageBucket: "centroemmapw.appspot.com",
  messagingSenderId: "590417149871",
  appId: "1:590417149871:web:0e3a7145803786fc64b95a",
  measurementId: "G-MK1LFX0E15",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
const storage = getStorage();
const analytics = getAnalytics(app);

export class FirebaseManage {
  async authenticate(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password).then(
        (usr) => {
          return usr;
        }
      );
    } catch (error) {
      console.error(error.message);
      // Mostrar alerta de error de inicio de sesión
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message,
      });

      return false;
    }
  }

  async signOut() {
    try {
      await signOut(auth).then(() => sessionStorage.removeItem("MY_USER"));
    } catch (error) {
      console.error(error.message);
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Correo electrónico enviado",
        text: "Se ha enviado un correo electrónico de restablecimiento de contraseña a la dirección proporcionada.",
      });
    } catch (error) {
      console.error(
        "Error al enviar el correo electrónico de restablecimiento de contraseña:",
        error
      );
      throw new Error(
        "Error al enviar el correo electrónico de restablecimiento de contraseña."
      );
    }
  }

  async saveImageOnStorage(image) {
    try {
      const imageDataRef = storageRef(storage, "images/" + image.name);
      const uploadTask = uploadBytesResumable(imageDataRef, image);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw new Error("Error al subir la imagen.");
    }
  }

  async sendContactUsData(data) {
    data.date = getCurrentDate();
    try {
      const formDataRef = ref(database, "contactUs");
      await push(formDataRef, data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async sendNewsData(data) {
    try {
      const formDataRef = ref(database, "news");
      await push(formDataRef, data);
    } catch (error) {
      console.error("Error al crear la noticia:", error);
      throw new Error("Error al crear la noticia.");
    }
  }

  async showContactUsData() {
    try {
      const dataRef = ref(database, "contactUs");
      return get(dataRef).then((snapshot) => {
        const contactUsList = [];
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            const contactUsKey = child.key;
            const contactUsData = child.val();

            const contactUsObject = {
              id: contactUsKey,
              email: contactUsData.email,
              fullName: contactUsData.fullName,
              phone: contactUsData.phone,
              message: contactUsData.message,
              date: contactUsData.date,
            };

            contactUsList.unshift(contactUsObject);
          });
        }
        return contactUsList;
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async showNewsData() {
    try {
      const dataRef = ref(database, "news");
      return get(dataRef).then((snapshot) => {
        const newsList = [];
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            const newsKey = child.key;
            const newsData = child.val();

            const newsObject = {
              id: newsKey,
              author: newsData.author,
              content: newsData.content,
              date: newsData.date,
              frontImage: newsData.frontImage,
              hour: newsData.hour,
              title: newsData.title,
            };

            newsList.push(newsObject);
          });
        }
        return newsList;
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  showNewsDataById(id) {
    try {
      const dataRef = ref(database, `news/${id}`);
      let newsObject = {};
      return get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
          const newsData = snapshot.val();
          newsObject = {
            id: id,
            author: newsData.author,
            content: newsData.content,
            date: newsData.date,
            frontImage: newsData.frontImage,
            hour: newsData.hour,
            title: newsData.title,
          };
        }
        return newsObject;
      });
    } catch (error) {
      console.error(error.message);
    }
  }
}

const getCurrentDate = () => {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date().toLocaleString("es-ES", options);
  const hour12 = date.split(", ")[1];
  const [hour, minutes] = hour12.split(":");
  const ampm = hour < 12 ? "AM" : "PM";
  const hourFormat12 = hour % 12 || 12;
  const formattedHour = hourFormat12.toString().padStart(2, "0");
  const formattedDate =
    date.split(", ")[0] + ` (${formattedHour}:${minutes}${ampm})`;

  return formattedDate;
};
