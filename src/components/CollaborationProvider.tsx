
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

type CollabUser = {
  id: string;
  name: string;
  color: string;
};

type CollabDocument = {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  currentUsers: CollabUser[];
};

type CollaborationContextType = {
  currentDocument: CollabDocument | null;
  shareDocument: (title: string, content: string) => string;
  joinDocument: (documentId: string, userName?: string) => boolean;
  updateDocument: (title: string, content: string) => void;
  currentUsers: CollabUser[];
  isCollaborating: boolean;
  documentId: string | null;
};

// Randomly generated colors for users
const userColors = [
  "#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A8",
  "#33FFF0", "#FFD733", "#33FFAA", "#AA33FF", "#FF3347"
];

const defaultContext: CollaborationContextType = {
  currentDocument: null,
  shareDocument: () => "",
  joinDocument: () => false,
  updateDocument: () => {},
  currentUsers: [],
  isCollaborating: false,
  documentId: null
};

const CollaborationContext = createContext<CollaborationContextType>(defaultContext);

export function useCollaboration() {
  return useContext(CollaborationContext);
}

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, CollabDocument>>({});
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [currentUsers, setCurrentUsers] = useState<CollabUser[]>([]);
  const [userId] = useState<string>(`user-${Date.now().toString(36)}`);

  // In a real app, we would use WebSockets or a similar technology
  // This is a simplified simulation for demonstration purposes
  
  useEffect(() => {
    // Simulate periodic updates from other users
    const interval = setInterval(() => {
      if (currentDocumentId && documents[currentDocumentId]) {
        // Simulate user presence updates
        const doc = documents[currentDocumentId];
        
        // Update connected users (normally this would come from server)
        if (Math.random() > 0.7) {
          simulateUserActivity(currentDocumentId);
        }
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentDocumentId, documents]);
  
  // Simulate other users joining/leaving
  const simulateUserActivity = (docId: string) => {
    const doc = {...documents[docId]};
    
    // Random chance for user to join/leave
    if (Math.random() > 0.5 && doc.currentUsers.length < 5) {
      // Add a simulated user
      const randomName = `User ${Math.floor(Math.random() * 1000)}`;
      const randomId = `sim-user-${Date.now().toString(36)}`;
      const randomColor = userColors[Math.floor(Math.random() * userColors.length)];
      
      const newUser: CollabUser = {
        id: randomId,
        name: randomName,
        color: randomColor
      };
      
      doc.currentUsers = [...doc.currentUsers, newUser];
      setDocuments(prev => ({...prev, [docId]: doc}));
      setCurrentUsers(doc.currentUsers);
      
      toast({
        title: "User joined",
        description: `${randomName} joined the document`,
      });
    } else if (doc.currentUsers.length > 1) {
      // Remove a simulated user
      const simulatedUsers = doc.currentUsers.filter(u => u.id !== userId);
      if (simulatedUsers.length > 0) {
        const randomIndex = Math.floor(Math.random() * simulatedUsers.length);
        const userToRemove = simulatedUsers[randomIndex];
        
        doc.currentUsers = doc.currentUsers.filter(u => u.id !== userToRemove.id);
        setDocuments(prev => ({...prev, [docId]: doc}));
        setCurrentUsers(doc.currentUsers);
        
        toast({
          title: "User left",
          description: `${userToRemove.name} left the document`,
        });
      }
    }
  };

  const shareDocument = (title: string, content: string): string => {
    const docId = `doc-${Date.now().toString(36)}`;
    
    // Create current user
    const currentUser: CollabUser = {
      id: userId,
      name: "You",
      color: userColors[0]
    };
    
    // Create a new document
    const newDocument: CollabDocument = {
      id: docId,
      title,
      content,
      lastUpdated: new Date(),
      currentUsers: [currentUser]
    };
    
    // Add document to state
    setDocuments(prev => ({
      ...prev,
      [docId]: newDocument
    }));
    
    setCurrentDocumentId(docId);
    setCurrentUsers([currentUser]);
    
    // Return shareable ID
    return docId;
  };

  const joinDocument = (documentId: string, userName = "Guest"): boolean => {
    if (!documents[documentId]) {
      // In a real app, we would fetch the document from server
      // For demo, we'll create an empty document
      const newDocument: CollabDocument = {
        id: documentId,
        title: "Shared Document",
        content: "This is a shared document.",
        lastUpdated: new Date(),
        currentUsers: []
      };
      
      setDocuments(prev => ({
        ...prev,
        [documentId]: newDocument
      }));
    }
    
    // Add current user to document
    const currentUser: CollabUser = {
      id: userId,
      name: userName,
      color: userColors[Math.floor(Math.random() * userColors.length)]
    };
    
    setDocuments(prev => {
      const updatedDoc = {
        ...prev[documentId],
        currentUsers: [...(prev[documentId]?.currentUsers || []), currentUser]
      };
      
      return {
        ...prev,
        [documentId]: updatedDoc
      };
    });
    
    setCurrentDocumentId(documentId);
    
    const doc = documents[documentId];
    if (doc) {
      setCurrentUsers([...doc.currentUsers, currentUser]);
    } else {
      setCurrentUsers([currentUser]);
    }
    
    return true;
  };

  const updateDocument = (title: string, content: string) => {
    if (!currentDocumentId) return;
    
    setDocuments(prev => {
      if (!prev[currentDocumentId]) return prev;
      
      return {
        ...prev,
        [currentDocumentId]: {
          ...prev[currentDocumentId],
          title,
          content,
          lastUpdated: new Date()
        }
      };
    });
  };

  return (
    <CollaborationContext.Provider
      value={{
        currentDocument: currentDocumentId ? documents[currentDocumentId] : null,
        shareDocument,
        joinDocument,
        updateDocument,
        currentUsers,
        isCollaborating: currentDocumentId !== null,
        documentId: currentDocumentId
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}
