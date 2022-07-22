export const initialState = null; //initial value for user is null

export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload;
    }
    if (action.type === "LOGOUT") {
        return null;
    }
    if (action.type === "UPDATE") {
        return {
            ...state, //expand what we currently have in state
            following: action.payload.following,//append to the state
            followers: action.payload.followers,//append to the state
        }
    }
    // if (action.type === "UPDATEAPPROVED") {
    //     return {
    //         ...state, //expand what we currently have in state
    //         ApprovedIds: action.payload.ApprovedIds,//append to the state
    //     }
    // }
    if(action.type=="UPDATEPIC"){
        return {
            ...state,
            profilePicUrl:action.payload
        }}
        if(action.type=="UPDATEREQUEST"){
            return {
                ...state,
                Requested:action.payload
            }}
    if(action.type=="UPDATETRUE"){
            return {
                ...state,
                isPrivate:true
            }    
    }
    if(action.type=="UPDATEFALSE"){
        return {
            ...state,
            isPrivate:false
        }    
}
    if(action.type=="UPDATESAVEDPOST"){
        return {
            ...state,
            savedPost:action.payload
        }    
}
    return state;
}