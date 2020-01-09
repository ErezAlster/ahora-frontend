
import { RestCollectorClient } from "rest-collector";
import { SearchCriterias } from "app/components/SearchDocsInput";
import { UserItem } from "./users";
import { DocWatchers } from "./watchers";

export interface Doc {
    id: number;
    subject: string;
    description: string;
    docTypeId: number;
    userAlias: string;
    metadata: any;
    createdAt: Date;
    labels?: number[];
    updatedAt: Date;
    htmlDescription: string;
    status: number;
    assignee?: UserItem
}


export interface VideoDoc extends Doc {
    metadata: {
        youtubeId: string;
    };
}



const docsClient: RestCollectorClient = new RestCollectorClient("/api/organizations/{login}/docs/{id}");
export const getDocs = async (login: string, query?: SearchCriterias): Promise<Doc[]> => {
    const result = await docsClient.get({
        params: { login },
        query: query
    });

    return result.data;
}

export const getDoc = async (login: string, id: number): Promise<Doc> => {
    const result = await docsClient.get({
        params: { id, login }
    });

    return result.data;
}

export const assignDoc = async (login: string, id: number, username: string): Promise<UserItem> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${id}/assignee`,
        data: { username }
    });
    return result.data;
}

export const watchDoc = async (login: string, id: number): Promise<DocWatchers> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${id}/watch`
    });
    return result.data;
}

export const unwatchDoc = async (login: string, id: number): Promise<UserItem> => {
    const result = await docsClient.post({
        url: `/api/organizations/${login}/docs/${id}/unwatch`
    });
    return result.data;
}

export const addDoc = async (login: string, doc: Doc): Promise<Doc> => {
    const result = await docsClient.post({
        params: { login },
        data: doc
    });
    return result.data;
}

export const updateDoc = async (login: string, id: number, doc: Doc): Promise<Doc> => {
    const result = await docsClient.put({
        params: { login, id },
        data: doc
    });
    return result.data;
}

export const deleteDoc = async (login: string, id: number): Promise<void> => {
    await docsClient.delete({
        params: { login, id }
    });
}