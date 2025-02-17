import { Header, Category } from "components/Common";
import feed from "data/request/feed";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DetailsPostComment,
  DetailsPostContent,
  DetailsPostInfo,
  DetailsPostSkeleton,
  DetailsPostThumbnail,
  DetailsPostTag,
} from "components/DetailsPost";
import * as S from "./style";
import * as I from "assets/svg";
import { CommentInterface } from "interfaces/CommentInterface";
import { loggedAtom, removeCommentModalAtom } from "atoms";
import { useRecoilState } from "recoil";
import DetailsPostTextarea from "../CommentTextarea";
import { useQuery } from "react-query";
import RemoveCommentModal from "components/Modal/CommentDeleteModal";
import TokenService from "util/TokenService";

function DetailsPostPage() {
  const [logged] = useRecoilState(loggedAtom);
  const [removeCommentModal] = useRecoilState(removeCommentModalAtom);
  const [response, setResponse] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getDetailsPostData = async () => {
      setLoading(false);
      try {
        const res: any = await feed.getDetailsPost(
          Number(params.postId),
          logged ? TokenService.getLocalAccessToken() : ""
        );
        setIsLiked(res.data.isLiked);
        setResponse(res.data);
        setLoading(true);
      } catch (e: any) {
        if (e.response.status === 404 || e.response.status === 400) {
          navigate(`/notfound/${params.postId}`);
        }
        console.log(e);
      }
    };

    getDetailsPostData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Like = async () => {
    try {
      if (isLiked) {
        await feed.CancleLikePost(Number(params.postId));
        setIsLiked(!isLiked);
      } else {
        await feed.LikePost(Number(params.postId));
        setIsLiked(!isLiked);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetching = async () => {
    try {
      const res: any = await feed.getDetailsPost(
        Number(params.postId),
        logged ? TokenService.getLocalAccessToken() : ""
      );
      setIsLiked(res.data.isLiked);
      setResponse(res.data);
    } catch (e: any) {
      console.log(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const commentQuery = useQuery({
    queryKey: "feed",
    queryFn: fetching,
    refetchOnWindowFocus: false,
  });

  return (
    <React.Fragment>
      <Header isNeedSearch={false} />
      <S.DetailsPostLayout>
        {removeCommentModal && <RemoveCommentModal />}
        {loading ? (
          <>
            <S.Box>
              <S.Title>{response.title}</S.Title>
              <S.SvgBox onClick={Like} isLiked={isLiked}>
                {isLiked ? <I.PostLiked /> : <I.PostLike />}
              </S.SvgBox>
            </S.Box>
            <DetailsPostTag tagList={response.tagList} />
            <DetailsPostInfo
              author={response.author}
              createdAt={response.createdAt}
              like={response.likeCount}
              hit={response.hit}
            />
            <DetailsPostThumbnail imageUrl={response.thumbnail} />
            <DetailsPostContent content={response.content} />
            <Category>📖 댓글</Category>
            <DetailsPostTextarea />
          </>
        ) : (
          <DetailsPostSkeleton />
        )}
        {response.comments?.map((idx: CommentInterface) => (
          <DetailsPostComment
            key={idx.id}
            id={idx.id}
            author={idx.author}
            content={idx.content}
            createdAt={idx.createdAt}
            isMine={idx.isMine}
            setState={setResponse}
          />
        ))}
      </S.DetailsPostLayout>
    </React.Fragment>
  );
}

export default DetailsPostPage;
