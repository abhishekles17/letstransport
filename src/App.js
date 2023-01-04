import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [comments, setComments] = useState([]);
  const [valueObj, setValueObj] = useState({});
  const [depthArray, setDepthArray] = useState([false]);

  useEffect(() => {
    if (localStorage.getItem("comments") === null) {
      fetch("https://www.mocky.io/v2/5dc596503200008200769be8")
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setComments(result);

      });
    }
    else {
     const persisted =  JSON.parse(localStorage.getItem('comments')) || [];
     setComments(persisted)
    }
  }, []);


  useEffect(() => {

    if(comments && comments.length > 0) {
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  },[comments])

  const handleChange = (e) => {
    valueObj[e.target.id] = e.target.value;
    setValueObj(valueObj);
  };

  const addingRecursively = (id, childComments) => {
    childComments &&
      childComments.length > 0 &&
      childComments.forEach((item, index) => {
        if (item._id === id) {
          if (!item.hasOwnProperty("children")) {
            item["children"] = [];
          }

          item.children.push({
            _id: id + "_" + item.children.length,
            comment: valueObj[id],
          });
          setValueObj({})
        } else {
          addingRecursively(id, item.children);
        }
      });
  };

  const handleShowMore = (depth) => {
    const _depthArray = [...depthArray];
    _depthArray[depth] = true;
    setDepthArray(_depthArray);
  };

  const handleShowLess = (depth) => {
    const _depthArray = [...depthArray];
    _depthArray[depth] = false;
    setDepthArray(_depthArray);
  };



  const addNewComment = (id) => {
    const _comments = [...comments];
    addingRecursively(id, _comments);
    setComments(_comments);
  };

  const AllComments = ({ child, depth }) => {
    return child.map((comment, index) => {
      return (
        <>
          <div className={index > 0 && !depthArray[depth] ? "none" : ""}>
            <Eachcomment eachComment={comment} depth={depth} />
          </div>
          {index === child.length - 1 ? !depthArray[depth] ? (
            <div
              className="showMore"
              onClick={() => {
                handleShowMore(depth);
              }}
            >
              Show more
            </div>
          ): (<div
          className="showMore"
          onClick={() => {
            handleShowLess(depth);
          }}
        >
          Show Less
        </div>) : null}
        </>
      );
    });
  };

  const Eachcomment = ({ eachComment, depth }) => {
    const { comment = "", _id = "" } = eachComment;
    return (
      <div className="commentContainer">
        <div className="comment">{comment}</div>
        <textarea
          type="text"
          className="textArea"
          id={_id}
          value={valueObj[_id]}
          onChange={handleChange}
        />
        <button
          className="replyButton"
          onClick={() => {
            addNewComment(_id);
          }}
        >
          Reply
        </button>
        {eachComment.children && eachComment.children.length > 0 && (
          <AllComments child={eachComment.children} depth={++depth} />
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <AllComments child={comments} depth={0} />
    </div>
  );
}

export default App;
