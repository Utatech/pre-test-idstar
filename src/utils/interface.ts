export interface Users {
    id: number,
    name: string,
    email: string,
    gender: string,
    status: string
}

export interface Posts {
    id: number,
    user_id: number,
    title: string,
    body: string,
}