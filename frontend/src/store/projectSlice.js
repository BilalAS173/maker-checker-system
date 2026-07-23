import {createSlice} from "@reduxjs/toolkit";
const projectSlice= createSlice({
    name: "project",
    initialState: null,
    reducers:  {
        selectProject(state, action) {
            return action.payload;
        },
        clearProject () {
            return null;
        },
    },
});

export const {selectProject, clearProject}=projectSlice.actions;
export default projectSlice.reducer;