import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";
import { ImExit } from "react-icons/im";

import { useRefs } from "../../hooks/useRefs";
import ShareModal from "../../modals/ShareModal";
import ColorPicker from "./ColorPicker";
import LineWidthPicker from "./LineWidthPicker";
import ModePicker from "./ModePicker";
import BackgroundPicker from "./BackgoundPicker";
import HistoryBtns from "./HistoryBtns";
import ShapeSelector from "./ShapeSelector";
import ImagePicker from "./ImagePicker";

import { useViewportSize } from "@/common/hooks/useViewportSize";
import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { DEFAULT_EASE } from "@/common/constants/easings";
import { useModal } from "@/common/recoil/modal";

const ToolBar = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { width } = useViewportSize();
  const { canvasRef, bgRef } = useRefs();

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(width >= 1024);
  }, [width]);

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const ctx = canvas.getContext("2d");
    if (ctx && canvasRef.current && bgRef.current) {
      ctx.drawImage(bgRef.current, 0, 0);
      ctx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click();
  };

  const handleExit = () => router.push("/");
  const handleShare = () => openModal(<ShareModal />);

  return (
    <>
      {/* Toggle for smaller screens */}
      <motion.button
        onClick={() => setOpened(!opened)}
        className="fixed bottom-4 left-4 z-40 flex max-w-[95%] flex-wrap items-center justify-start gap-6 rounded-2xl bg-gradient-to-br from-indigo-800 to-purple-700 bg-opacity-90 p-4 text-white shadow-2xl backdrop-blur-md"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2, ease: DEFAULT_EASE }}
        title="Toggle Toolbar"
      >
        <FiChevronRight />
      </motion.button>

      <motion.div
        className="fixed bottom-4 left-1/2 z-40 flex max-w-[95%] -translate-x-1/2 flex-wrap items-center justify-center gap-6 rounded-2xl bg-gradient-to-br from-indigo-800 to-purple-700 bg-opacity-90 p-4 text-white shadow-2xl backdrop-blur-md"
        animate={{ y: opened ? 0 : 120 }}
        transition={{ duration: 0.25, ease: DEFAULT_EASE }}
      >
        <ToolGroup title="Mode">
          <ModePicker />
        </ToolGroup>
        <ToolGroup title="Shapes">
          <ShapeSelector />
        </ToolGroup>
        <ToolGroup title="Color">
          <ColorPicker />
        </ToolGroup>
        <ToolGroup title="Line Width">
          <LineWidthPicker />
        </ToolGroup>
        <ToolGroup title="Background">
          <BackgroundPicker />
        </ToolGroup>
        <ToolGroup title="Image">
          <ImagePicker />
        </ToolGroup>
        <ToolGroup title="Undo / Redo">
          <HistoryBtns />
        </ToolGroup>
        <ToolGroup title="Actions">
          <IconButton title="Share Board" onClick={handleShare}>
            <IoIosShareAlt />
          </IconButton>
          <IconButton title="Download Image" onClick={handleDownload}>
            <HiOutlineDownload />
          </IconButton>
          <IconButton title="Exit Room" onClick={handleExit}>
            <ImExit />
          </IconButton>
        </ToolGroup>
      </motion.div>
    </>
  );
};

export default ToolBar;

/* --- Utility Components --- */

const ToolGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-xs font-semibold text-zinc-300">{title}</p>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

const IconButton = ({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <motion.button
    onClick={onClick}
    title={title}
    whileHover={{ scale: 1.2 }}
    className="btn-icon rounded-xl bg-white/10 p-2 text-xl text-white transition-all hover:bg-white/20"
  >
    {children}
  </motion.button>
);
