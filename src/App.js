import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { useState, useEffect, useRef } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA1lmP2w8kvfttndtEg-S9odPFzE1Z8oOE",
  authDomain: "vds-database.firebaseapp.com",
  projectId: "vds-database",
  storageBucket: "vds-database.appspot.com",
  messagingSenderId: "513241215688",
  appId: "1:513241215688:web:f688a4c298f61b5304ebfd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getVersionAndUpdateCount() {
  const docRef = doc(db, "users", "S7Xl8DAdgOGn7modEAnv");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let currentCount = docSnap.data().users;
    const versions = ["A", "B", "C"];
    const version = versions[currentCount % 3];

    setTimeout(async () => {
      await updateDoc(docRef, { users: currentCount + 1 });
    }, 10000); // Update count after 10 seconds

    return version;
  } else {
    console.error("No such document!");
    return null;
  }
}

function VideoComponent({ videoSource, redirectUrl }) {
  const videoRef = useRef(null);
  const videoPlayedKey = "sfsfs";
  const [hasVideoBeenPlayed, setHasVideoBeenPlayed] = useState(
    localStorage.getItem(videoPlayedKey) === "true"
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (hasVideoBeenPlayed) {
      window.location.href = redirectUrl;
    } else if (videoElement) {
      videoElement.autoplay = true;
      videoElement.controls = true;
      videoElement.addEventListener("ended", () => {
        localStorage.setItem(videoPlayedKey, "true");
        setHasVideoBeenPlayed(true);
        window.location.href = redirectUrl;
      });
    }
  }, [hasVideoBeenPlayed, redirectUrl]);

  return (
    <>
      <style>{`
        .video-container {
          position: fixed;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #yourVideoElementId {
          max-width: calc(100% - 20px);
          max-height: calc(100% - 20px);
          object-fit: cover;
        }
      `}</style>
      <div className="video-container">
        {hasVideoBeenPlayed ? (
          <a href={redirectUrl}>Redirecting To New Webpage</a>
        ) : (
          <video
            ref={videoRef}
            id="yourVideoElementId"
            src={videoSource}
            controls
            muted
          />
        )}
      </div>
    </>
  );
}

export default function FireBaseABTestComponent() {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      getVersionAndUpdateCount().then(setVersion);
    }, 10000); // 10-second delay before updating Firebase

    return () => clearTimeout(timer);
  }, []);

  const pageProps = {
    A: {
      videoSource:
        "https://zeshuzhu.com/wp-content/uploads/2024/05/5s.mp4",
      redirectUrl:
        "https://forms.office.com/e/DPkbKEe429",
    },
    B: {
      videoSource:
        "https://zeshuzhu.com/wp-content/uploads/2024/05/6.5s.mp4",
      redirectUrl:
        "https://forms.office.com/e/Kpcgqd89EG",
    },
    C: {
      videoSource:
        "https://zeshuzhu.com/wp-content/uploads/2024/05/8s.mp4",
      redirectUrl:
        "https://forms.office.com/e/qN1HsEhuq8",
    },
  };

  if (!version) return <div>Loading...</div>;

  return <VideoComponent {...pageProps[version]} />;
}
