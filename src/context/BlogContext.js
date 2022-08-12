import createDataContext from "./createDataContext";

const blogReducer = (state, action) => {
  switch (action.type) {
    case "add_post":
      return [
        ...state,
        {
          id: Math.floor(Math.random() * 99999),
          title: action.payload.title,
          content: action.payload.content,
        },
      ];
    case "delete_post":
      return state.filter((blogPost) => blogPost.id !== action.payload);
    case "edit_post":
      return [
        ...state.filter((blogPost) => blogPost.id !== action.payload.id),
        {
          id: action.payload.id,
          title: action.payload.title,
          content: action.payload.content,
        },
      ];
    default:
      return state;
  }
};

const addBlogPost = (dispatch) => {
  return (title, content, callback) => {
    dispatch({ type: "add_post", payload: { title, content } });
    callback();
  };
};

const deleteBlogPost = (dispatch) => {
  return (id) => {
    dispatch({ type: "delete_post", payload: id });
  };
};

const editBlogPost = (dispatch) => {
  return (title, content, id, callback) => {
    dispatch({ type: "edit_post", payload: { id, title, content } });
    callback();
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost },
  [{ title: "Test post", content: "test blog content", id: 1 }]
);
