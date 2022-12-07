import { loggedAtom } from "atoms";
import { Category } from "components/Common";
import HotPostBox from "components/Common/PostBox/HotPostBox";
import feed from "data/request/feed";
import { marked } from "marked";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import TokenService from "util/TokenService";
import * as S from "./style";

function MainPageHotPosts() {
  const [logged] = useRecoilState(loggedAtom);
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    const getHotPosts = async () => {
      try {
        const res: any = await feed.getHotPostsList(
          logged && TokenService.getLocalAccessToken()
        );

        setList(res.data.list);
      } catch (e: any) {
        console.log(e);
      }
    };
    getHotPosts();
  }, []);

  return (
    <S.HotPostsLayout>
      <S.CategoryBox>
        <Category>🔥 HOT’</Category>
      </S.CategoryBox>
      <S.HotPostList>
        <>
          {list.map((idx) => (
            <div key={idx.id}>
              <HotPostBox
                id={idx.id}
                thumbnail={idx.thumbnail}
                title={idx.title}
                content={
                  marked(idx.previewContent).replace(/<[^>]+>/g, "") + "..."
                }
                like={idx.likeCount}
                hit={idx.hit}
              />
            </div>
          ))}
        </>
      </S.HotPostList>
    </S.HotPostsLayout>
  );
}

export default MainPageHotPosts;
