import { configureStore } from '@reduxjs/toolkit'
import projectsSlice from './projectsSlice'
import projectDetailsSlice from './projectDetailsSlice'
import deletedProjectsSlice from './deletedProjectsSlice'
import { useDispatch } from 'react-redux'

export const store = configureStore({
    reducer: {
        projectsState: projectsSlice,
        projectDetailsState: projectDetailsSlice,
        deletedProjectsState: deletedProjectsSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
