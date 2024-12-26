import { makeAutoObservable } from "mobx";


class ApplicationStore {
    loginVisible = false;
    constructor() {
        makeAutoObservable(this);
    }
}

export const applicationStore = new ApplicationStore();
