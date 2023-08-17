import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/lg-douzone-color.svg';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  const location = useLocation(); // 현재 페이지의 주소 정보를 가져옴
  const currentPath = location.pathname;
  const loginPath = "/auth/login";

  // 현재 주소가 로그인 페이지인 경우 링크 없이 로고만 표시
  if (currentPath === loginPath) {
    return <LogoDark height={70} />;
  }

  // 그 외의 경우에는 링크와 함께 로고 표시
  return (
    <LinkStyled to="/">
      <LogoDark height={70} />
    </LinkStyled>
  );
};

export default Logo;