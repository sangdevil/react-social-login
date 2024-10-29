import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';


/*

현재 페이지는 http://localhost:3000/oauth/redirected/kakao 를 담당하는 페이지로, 
현재까지의 흐름을 정리하면
1. 유저가 login 버튼을 클릭 
2. 유저가 http://localhost:8080/oauth/kakao로 redirect
3. 스프링 백엔드에서는, 즉 KakaoAuthCodeRequestUrlProvider에서 설정한 client_id, response_type, redirect_uri 등을 담아서 유저를 다시 https://kauth.kakao.com/oauth/authorize로 리다이렉트
4. 카카오에서는 해당 요청을 받아서 유저가 로그인하면 auth code를 설정된 redirect_uri, 즉 /oauth/redirected/kakao로 보냄.
5. 이제 여기서 받은 코드를 http://localhost:8080/oauth/login/kakao?code=${code} 로 보냄. 즉, 유저의 로그인 시도, 성공 시 유저의 JWT 토큰을 백엔드로부터 받아옴
*/

const KakaoRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleOAuthKakao = async (code) => {
        try {
            // 카카오로부터 받아온 code를 서버에 전달하여 카카오로 회원가입 & 로그인한다
            const response = await axios.get(`http://localhost:8080/oauth/login/kakao?code=${code}`);
            const data = response.data; // 응답 데이터
            alert("로그인 성공: " + data)
            navigate("/success");
        } catch (error) {
            navigate("/fail");
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');  // 카카오는 Redirect 시키면서 code를 쿼리 스트링으로 준다.
        if (code) {
            alert("CODE = " + code)
            handleOAuthKakao(code);
        }
    }, [location]);

    return (
        <div>
            <div>Processing...</div>
        </div>
    );
};

export default KakaoRedirectPage;