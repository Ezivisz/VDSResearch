import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { useState, useEffect, useRef } from "react"

const firebaseConfig = {
    apiKey: "AIzaSyA1lmP2w8kvfttndtEg-S9odPFzE1Z8oOE",
    authDomain: "vds-database.firebaseapp.com",
    projectId: "vds-database",
    storageBucket: "vds-database.appspot.com",
    messagingSenderId: "513241215688",
    appId: "1:513241215688:web:f688a4c298f61b5304ebfd",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function getVersionAndUpdateCount() {
    const docRef = doc(db, "users", "S7Xl8DAdgOGn7modEAnv")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        let currentCount = docSnap.data().users
        const versions = ["A", "B", "C"]
        const version = versions[currentCount % 3]

        await updateDoc(docRef, { users: currentCount + 1 })

        return version
    } else {
        console.error("No such document!")
        return null
    }
}

function VideoComponent({ videoSource, redirectUrl }) {
    const videoRef = useRef(null)
    const videoPlayedKey = "sfsfs"
    const [hasVideoBeenPlayed, setHasVideoBeenPlayed] = useState(
        localStorage.getItem(videoPlayedKey) === "true"
    )

    useEffect(() => {
        const videoElement = videoRef.current
        if (hasVideoBeenPlayed) {
            window.location.href = redirectUrl
        } else if (videoElement) {
            videoElement.autoplay = true
            videoElement.controls = true
            videoElement.addEventListener("ended", () => {
                localStorage.setItem(videoPlayedKey, "true")
                setHasVideoBeenPlayed(true)
                window.location.href = redirectUrl
            })
        }
    }, [hasVideoBeenPlayed, redirectUrl])

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
    )
}

export default function FireBaseABTestComponent() {
    const [version, setVersion] = useState(null)

    useEffect(() => {
        getVersionAndUpdateCount().then(setVersion)
    }, [])

   const pageProps = {
        A: {
            videoSource:
                "https://zeshuzhu.com/wp-content/uploads/2024/04/VDSDensityLow.mp4",
            redirectUrl:
                "https://forms.office.com/Pages/ResponsePage.aspx?id=bGf3QlX0PEKC9twtmXka93AGtF4_r3RLoZb6ISLENWNUOVpYSUxKMU1ONTJYM1hNWDdOQkRFMVAxVy4u",
        },
        B: {
            videoSource:
                "https://zeshuzhu.com/wp-content/uploads/2024/04/VDSDensityMedium.mp4",
            redirectUrl:
                "https://forms.office.com/pages/responsepage.aspx?id=bGf3QlX0PEKC9twtmXka93AGtF4_r3RLoZb6ISLENWNUN1NQQzBYTEQ3WjY1QU0zVjQzMjNJSEFJRS4u",
        },
        C: {
            videoSource:
                "https://zeshuzhu.com/wp-content/uploads/2024/04/VDSDensityHigh.mp4",
            redirectUrl:
                "https://forms.office.com/pages/responsepage.aspx?id=bGf3QlX0PEKC9twtmXka93AGtF4_r3RLoZb6ISLENWNUNUJRR0dGN1BLQ00yTjBDV0hSWlZNWjNaMS4u",
        },
    }

    if (!version) return <div>Loading...</div>

    return <VideoComponent {...pageProps[version]} />
}
