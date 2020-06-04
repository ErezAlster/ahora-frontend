
import AhoraRestCollector from "./base";

export interface Comment {
    id: number;
    docId: number;
    comment: string;
    htmlComment: string;
    createdAt: Date;
    pinned: boolean;
    author: {
        username: string;
        displayName?: string;
    }
}


const commentsClient: AhoraRestCollector = new AhoraRestCollector("/api/organizations/{organizationId}/docs/{docId}/Comments/{id}");
export const getComments = async (login: string, docId: number): Promise<Comment[]> => {
    const result = await commentsClient.get({
        params: { login, docId }
    });

    return result.data;
}

export const getDoc = async (login: string, docId: number): Promise<Comment> => {
    const result = await commentsClient.get({
        params: {
            docId,
            login
        }
    });

    return result.data;
}

export const addComment = async (login: string, docId: number, comment: string): Promise<Comment> => {
    const result = await commentsClient.post({
        params: { login, docId },
        data: {
            comment
        }
    });
    return result.data;
}

export const updateComment = async (login: string, docId: number, id: number, comment: string): Promise<Comment> => {
    const result = await commentsClient.put({
        params: { login, docId, id },
        data: {
            comment
        }
    });
    return result.data;
}

export const deleteComment = async (login: string, comment: Comment): Promise<Comment> => {
    const result = await commentsClient.delete({
        params: { login, docId: comment.docId, id: comment.id }
    });
    return result.data;
}

export const togglePinComment = async (login: string, comment: Comment, pinned: boolean = false): Promise<Comment> => {
    const result = await commentsClient.put({
        params: { login, docId: comment.docId, id: comment.id },
        data: { pinned }
    });
    return result.data;
}