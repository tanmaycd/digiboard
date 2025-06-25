import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setRoomId = useSetRoomId();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [roomId, setRoomIdInput] = useState("");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [permission, setPermission] = useState<"edit" | "view">("edit");

  useEffect(() => {
    document.body.style.background =
      "linear-gradient(to right, #f8fbff, #e0f0fc)";
  }, []);

  useEffect(() => {
    socket.on("created", (id) => {
      setRoomId(id);
      router.push(id);
    });

    socket.on("joined", (id: string, failed?: boolean) => {
      if (failed) {
        openModal(<NotFoundModal id={roomId} />);
      } else {
        setRoomId(id);
        router.push(id);
      }
    });

    return () => {
      socket.off("created");
      socket.off("joined");
    };
  }, [openModal, roomId, router, setRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setRoomId("");
  }, [setRoomId]);

  const handleCreateRoom = () => {
    // Mocked: send roomType and permission as metadata (no logic tied to it)
    socket.emit("create_room", { username, roomType, permission });
  };

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    if (roomId) {
      socket.emit("join_room", roomId, username, { permission });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600">🎨 Digiboard</h1>
          <p className="text-gray-600 mt-2">Real-time visual collaboration</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Your Name</label>
            <input
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 15))}
            />
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <label className="font-semibold text-gray-700 block">Room ID</label>
            <input
              className="w-full rounded-md border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="e.g., room-abc-123"
              value={roomId}
              onChange={(e) => setRoomIdInput(e.target.value)}
            />

            <label className="block text-sm text-gray-600">Permission</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as "edit" | "view")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="edit">Edit Access</option>
              <option value="view">View Only</option>
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-medium py-2 rounded-md hover:bg-indigo-600 transition"
            >
              Join Room
            </button>
          </form>

          <div className="flex items-center text-gray-400 my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-2 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as "public" | "private")}
              className="w-full rounded-md border px-3 py-2 text-sm mb-3"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <button
              onClick={handleCreateRoom}
              className="w-full bg-green-500 text-white font-medium py-2 rounded-md hover:bg-green-600 transition"
            >
              Create New Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
