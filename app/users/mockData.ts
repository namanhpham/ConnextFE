// mockData.ts
export const users = [
  { id: "1", name: "John Doe", avatar: "J" },
  { id: "2", name: "Jane Smith", avatar: "J" },
];

export const messages: { [key: string]: { id: number; text?: string; imageUrl?: string; sender: string }[] } = {
  "1": [
    { id: 1, text: "Hi John!", sender: "current" },
    { id: 2, text: "Hey! How are you?", sender: "other" },
    { id: 3, text: "I'm good, thanks!", sender: "current" },
    { id: 4, text: "What about you?", sender: "current" },
    { id: 5, text: "I'm doing well, just busy with work.", sender: "other" },
    { id: 6, text: "Same here. Lots of projects.", sender: "current" },
    { id: 7, text: "We should catch up sometime.", sender: "other" },
    { id: 8, text: "Definitely! How about this weekend?", sender: "current" },
    { id: 9, text: "Sounds good to me.", sender: "other" },
    { id: 10, text: "Great! See you then.", sender: "current" },
    { id: 11, imageUrl: "https://via.placeholder.com/150", sender: "other" },
  ],
  "2": [
    { id: 1, text: "Hello Jane!", sender: "current" },
    { id: 2, text: "Hi! Long time no see!", sender: "other" },
    { id: 3, text: "Yeah, it's been a while.", sender: "current" },
    { id: 4, text: "How have you been?", sender: "current" },
    { id: 5, text: "I've been good, just busy with life.", sender: "other" },
    { id: 6, text: "I hear you. Same here.", sender: "current" },
    { id: 7, text: "We should meet up soon.", sender: "other" },
    { id: 8, text: "Absolutely! How about next week?", sender: "current" },
    { id: 9, text: "Next week works for me.", sender: "other" },
    { id: 10, text: "Perfect! Let's do it.", sender: "current" },
    { id: 11, imageUrl: "https://via.placeholder.com/150", sender: "current" },
  ],
};
