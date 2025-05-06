import { create } from "zustand";
import { AlteredRubizCodeFile } from "./interface";

type Store = {
  conversation: AlteredRubizCodeFile | null;
  setConversation: (data: AlteredRubizCodeFile) => void; // Accepts an id argument
};

const useConversationStore = create<Store>()((set) => ({
  conversation: null,
  setConversation: (data) => set({ conversation: data }), // Updates conversationId with the passed argument
}));

export { useConversationStore };
