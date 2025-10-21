# WebRTC Local Video Call System

This project is a sophisticated, local-first video communication system designed for educational environments. It empowers a "teacher" to monitor and initiate two-way video calls with "student" devices on the same local area network (LAN). The entire system is built using modern web technologies and leverages the power of WebRTC for peer-to-peer communication, ensuring privacy and low latency by keeping all media traffic within the local network.

## Core Features

- **Role-Based Interface**: Separate, intuitive user interfaces for "Teacher" and "Student" roles.
- **Device Registration**: Students can register their devices with a name, making them discoverable by the teacher.
- **Device Discovery**: The teacher's dashboard automatically displays a list of all registered student devices.
- **Real-Time Video/Audio Calls**: High-quality, low-latency, two-way video and audio communication powered by WebRTC.
- **Local-First Architecture**: All communication is peer-to-peer (P2P). No media data is sent to a central server, ensuring maximum privacy and performance on a local network.
- **Simulated Backend**: For demonstration purposes, this application runs entirely in the browser. It uses a simulated signaling channel and in-memory device storage to mimic the behavior of a real backend system.

## Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/) with Vite for a fast, modern development experience.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust, type-safe code.
- **Real-time Communication**: [WebRTC](https://webrtc.org/) (RTCPeerConnection, MediaStream API) for direct P2P video/audio streaming.
- **State Management**: React Context API for centralized and accessible application state management.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive, and modern design.

## How It Works: Simplified Architecture

This system demonstrates a complete WebRTC calling flow in a simulated LAN environment.

1.  **Signaling Simulation**: In a real-world WebRTC application, a "signaling server" (usually using WebSockets) is required to exchange metadata between peers before a connection can be established. This metadata includes session descriptions (SDP) and network candidates (ICE). To run this demo without a backend, we simulate this server using a browser `EventTarget`. This allows different components (and conceptually, different users in separate tabs) to broadcast and listen for signaling messages.

2.  **Device Registry Simulation**: Instead of a MySQL database, the list of registered student devices is stored in the React Context's state. When a student registers, their information is added to an array, which the teacher's view subscribes to. This state is lost on refresh.

3.  **The Call Flow**:
    - A user opens the app and selects a role (e.g., Student).
    - The student enters their name and clicks "Register." This assigns them a unique ID, adds them to the shared device list, and requests access to their camera/microphone.
    - Another user (or the same user in a new tab) selects the "Teacher" role. Their view renders the list of registered students from the shared state.
    - The teacher clicks "Call" on a student device. This triggers the WebRTC flow:
        a. An `RTCPeerConnection` is created.
        b. An "offer" (an SDP message describing the teacher's media capabilities) is generated.
        c. This offer is dispatched through the simulated signaling channel, addressed to the student's unique ID.
    - The student's application, listening to the signaling channel, receives the offer and displays an incoming call screen.
    - If the student clicks "Answer":
        a. Their `RTCPeerConnection` is created.
        b. The teacher's offer is set as the "remote description."
        c. An "answer" (the student's SDP) is generated and set as the "local description."
        d. The answer is sent back to the teacher via the signaling channel.
    - The teacher receives the answer and sets it as their remote description.
    - Both peers now know about each other. They begin exchanging network details (ICE candidates) through the signaling channel until they find the best path to connect directly, peer-to-peer.
    - Once the P2P connection is established, video and audio streams flow directly between the two users.

## How to Use the Application

To test the full functionality, you need to simulate two different users (one teacher and one student). The easiest way to do this is with two browser tabs.

1.  **Open Tab 1 (Teacher)**:
    - Open the application in your browser.
    - On the role selection screen, click **"I am a Teacher"**.
    - You will see the teacher dashboard, which will initially show "No students have registered yet." Your camera preview should appear on the right.

2.  **Open Tab 2 (Student)**:
    - Open the same application URL in a new browser tab or window.
    - On the role selection screen, click **"I am a Student"**.
    - You will be prompted to register. Enter a name (e.g., "Student Alice") and click **"Register"**.
    - Your camera will activate, and you will see a message: "Waiting for the teacher to call...".

3.  **Initiate the Call**:
    - Go back to **Tab 1 (Teacher)**.
    - The student you just registered ("Student Alice") will now appear in the "Student Devices" list.
    - Click the green **"Call"** button under the student's name.

4.  **Answer the Call**:
    - Go back to **Tab 2 (Student)**.
    - The view will change to an incoming call screen, showing who is calling.
    - Click the green **"Answer"** button.

5.  **Connect**:
    - The P2P connection will be established, and a two-way video call will begin in both tabs.
    - You can see the remote video in the main view and your local video in a small preview window.

6.  **End the Call**:
    - Either the teacher or the student can end the call by clicking the red **"Hang Up"** button (phone icon). This will terminate the connection and return both users to their respective dashboards.

## From Prototype to Production

This project serves as a robust prototype. To make it a production-ready system, the following steps would be necessary:

1.  **Implement a Real Signaling Server**: Replace the `EventTarget` simulation with a dedicated backend server using WebSockets (e.g., with Node.js, Express, and the `ws` library).
2.  **Persistent Device Registry**: Replace the in-memory device list with a database (e.g., MySQL, PostgreSQL, or Redis) to store registered devices and their signaling IDs.
3.  **Authentication**: Add a secure user authentication system to control access.
4.  **STUN/TURN Server Configuration**: While the public Google STUN servers work well, a production environment would require a reliable set of STUN servers and a TURN server to handle connections behind restrictive firewalls (NAT traversal).
5.  **Scalability**: Design the signaling architecture to be horizontally scalable to handle many concurrent users.
