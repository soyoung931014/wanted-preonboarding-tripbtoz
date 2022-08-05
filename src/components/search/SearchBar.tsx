import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';

import SearchDate from '@components/search/SearchDate';
import SearchCount from '@components/search/SearchCount';
import { CalendarModal } from '@components/calendar';
import GuestReservation from '@components/modal/GuestReservation';
import IconWrapper from '@wrappers/IconWrapper';
import useWindowDimensions from '@hooks/useWindowDimensions';
import useNavigateSearch from '@hooks/useNavigateSearch';
import useLocationString from '@hooks/useLocationString';
import { ISearchData } from '@type/search';
import theme from '@styles/theme';

function SearchBar() {
  const locationQuery = useLocationString();
  const { width } = useWindowDimensions();
  const navigateSearch = useNavigateSearch();
  const [isWebWidth, setIsWebWidth] = useState<boolean>(true);

  const [isOpenModal, setIsOpenModal] = useState<{ [key: string]: boolean }>({
    calendar: false,
    occupancy: false,
  });

  const [searchData, setSearchData] = useState<ISearchData>({
    calendar: {
      checkIn: locationQuery.checkIn,
      checkOut: locationQuery.checkOut,
    },
    occupancy: {
      adult: locationQuery.adult ? +locationQuery.adult : 2,
      kid: locationQuery.kid ? +locationQuery.kid : 0,
    },
  });

  const handleModal = (key: string, value: boolean) => {
    if (isWebWidth) {
      if (key === 'focus') {
        return setIsOpenModal(() => ({ calendar: false, occupancy: false }));
      }
      if (key === 'next')
        return setIsOpenModal(() => ({ calendar: false, occupancy: true }));
    }
    if (!isWebWidth) {
      if (key === 'next') return;
      if (value) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
    }

    setIsOpenModal(isOpenModal => ({ ...isOpenModal, [key]: value }));
  };

  const handleSearch = () => {
    const { checkIn, checkOut } = searchData.calendar;
    const { adult, kid } = searchData.occupancy;
    if (!adult && !kid) return navigateSearch('/', { checkIn, checkOut });
    if (!checkIn || !checkOut) return navigateSearch('/', { adult, kid });
    navigateSearch('/', { checkIn, checkOut, adult, kid });
    setIsOpenModal(() => ({ calendar: false, occupancy: false }));
  };

  useEffect(() => {
    if (width <= +theme.size.middle.slice(0, -2)) {
      setIsWebWidth(false);
      if (isOpenModal.calendar || isOpenModal.occupancy)
        document.body.style.overflow = 'hidden';
    } else {
      setIsWebWidth(true);
      if (isOpenModal.calendar || isOpenModal.occupancy)
        document.body.style.overflow = '';
    }
  }, [width]);

  return (
    <SearchBarContainer>
      <SearchDate
        isWeb={isWebWidth}
        handleModal={handleModal}
        searchData={searchData}
      />
      <CalendarModal
        isOpenModal={isOpenModal}
        searchData={searchData}
        handleModal={handleModal}
        handleSearch={handleSearch}
        setSearchData={setSearchData}
      />
      <SearchCount
        isWeb={isWebWidth}
        handleModal={handleModal}
        searchData={searchData}
      />
      <GuestReservation
        isOpenModal={isOpenModal}
        handleModal={handleModal}
        searchData={searchData}
        setSearchData={setSearchData}
        handleSearch={handleSearch}
      />
      {isWebWidth && (
        <SearchButtonWrapper onClick={handleSearch}>
          <IconWrapper icon={<AiOutlineSearch />} color="pink_02" />
        </SearchButtonWrapper>
      )}
    </SearchBarContainer>
  );
}

export default SearchBar;

const SearchBarContainer = styled.div`
  margin: auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.grey_03};
  border-radius: 4px;
  @media ${({ theme }) => theme.deviceSize.middle} {
    padding: 0 8px;
    width: 100%;
    display: block;
    border: none;
  }
  @media ${({ theme }) => theme.deviceSize.mobile} {
    padding: 0;
    min-width: 300px;
    display: block;
    border: none;
  }
`;

const SearchButtonWrapper = styled.button`
  position: relative;
  padding: 20px;
  background-color: transparent;
  z-index: 110;
`;
