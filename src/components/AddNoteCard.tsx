import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface AddNoteCardProps {
  onAddNote: (content: string) => void;
}

export function AddNoteCard({ onAddNote }: AddNoteCardProps) {
  const [isOnBoardingShowing, setIsOnBoardingShowing] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleEditorShow = () => {
    setIsOnBoardingShowing(false);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);

    !event.target.value && setIsOnBoardingShowing(true);
  };

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();

    if (!content) {
      toast.error("Please enter a note");
      return;
    }

    toast.success("Note saved successfully!");

    onAddNote(content);
    setContent("");
    setIsOnBoardingShowing(true);
  };

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Speech recognition API is not available in this browser!");
      return;
    }

    setIsRecording(true);
    setIsOnBoardingShowing(false);

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce(
        (text, result) => text.concat(result[0].transcript),
        ""
      );
      setContent(transcript);
    };

    recognition.onerror = (event) => toast.error(event.error);

    recognition.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    recognition && recognition.stop();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-slate-700 rounded-md text-start flex flex-col p-5 gap-3 outline-none relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Add note</span>
        <p className=" text-sm leading-6 text-slate-400">
          Record an audio note that will automatically be converted to text
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:start-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute end-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>

            <form className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Add a note
                </span>
                {isOnBoardingShowing ? (
                  <p className=" text-sm leading-6 text-slate-400">
                    Start by{" "}
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="text-lime-400 hover:underline"
                    >
                      recording an audio note{" "}
                    </button>{" "}
                    or, if you prefer,{" "}
                    <button
                      type="button"
                      onClick={handleEditorShow}
                      className="text-lime-400 hover:underline"
                    >
                      use only text
                    </button>
                  </p>
                ) : (
                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContentChange}
                    value={content}
                  />
                )}
              </div>

              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                >
                  <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                  Recording! (Click to stop)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="w-full bg-lime-400 py-4 text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                >
                  Save note
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
