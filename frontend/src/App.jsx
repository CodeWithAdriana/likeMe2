import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";

// Configurar Axios con una base URL
const api = axios.create({
  baseURL: "http://localhost:3000", // Asegúrate de que el backend esté corriendo en este puerto
});

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

  // Obtener todos los posts
  const getPosts = async () => {
    try {
      const { data: posts } = await api.get("/posts");
      setPosts(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Agregar un nuevo post
  const agregarPost = async () => {
    try {
      const post = { titulo, url: imgSrc, descripcion };
      await api.post("/posts", post);
      getPosts(); // Actualizar la lista de posts
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  // Incrementar likes de un post
  const like = async (id) => {
    try {
      await api.put(`/posts/like/${id}`);
      getPosts(); // Actualizar la lista de posts
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Eliminar un post
  const eliminarPost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      getPosts(); // Actualizar la lista de posts
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Obtener los posts al montar el componente
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post key={i} post={post} like={like} eliminarPost={eliminarPost} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
