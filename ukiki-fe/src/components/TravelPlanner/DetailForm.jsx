import React, { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { format, isSameDay, addMinutes, set } from 'date-fns';
import { fetchAirportsAPI } from '../../api/agency';
import {
  DetailFormContainer,
  Table,
  TableHeadCell,
} from './style/DetailFormStyle';

const DetailForm = ({ proposalData, setProposalData }) => {
  const handleChange = (e) => {
    setProposalData({
      ...proposalData,
      [e.target.name]: e.target.value,
    });
  };

  const getDateValue = (field) => {
    return proposalData[field] ? new Date(proposalData[field]) : null;
  };

  const handleDateChange = (field) => (date) => {
    let formattedValue = '';
    if (date) {
      if (field === 'startDate' || field === 'endDate') {
        formattedValue = date.toISOString().split('T')[0];
      } else {
        formattedValue = format(date, "yyyy-MM-dd'T'HH:mm");
      }
    }
    setProposalData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleNumberChange = (e) => {
    setProposalData({
      ...proposalData,
      [e.target.name]: Number(e.target.value),
    });
  };

  // ------------------------------
  // 공항 검색 관련 상태 및 로직
  // ------------------------------
  const [airports, setAirports] = useState([]);
  const [departureQuery, setDepartureQuery] = useState('');
  const [arrivalQuery, setArrivalQuery] = useState('');
  const [showDepartureSuggestions, setShowDepartureSuggestions] =
    useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);

  useEffect(() => {
    const getAirports = async () => {
      try {
        const data = await fetchAirportsAPI();
        setAirports(data);
      } catch (error) {
        console.error('공항 목록 불러오기 실패:', error);
      }
    };
    getAirports();
  }, []);

  const filteredDepartureAirports = airports.filter((airport) =>
    airport.name.toLowerCase().includes(departureQuery.toLowerCase()),
  );
  const filteredArrivalAirports = airports.filter((airport) =>
    airport.name.toLowerCase().includes(arrivalQuery.toLowerCase()),
  );

  const handleSelectDepartureAirport = (airport) => {
    setProposalData((prev) => ({
      ...prev,
      departureAirportName: airport.name,
      departureAirportCode: airport.airportCode,
    }));
    setDepartureQuery(airport.name);
    setShowDepartureSuggestions(false);
  };

  const handleSelectArrivalAirport = (airport) => {
    setProposalData((prev) => ({
      ...prev,
      arrivalAirportName: airport.name,
      arrivalAirportCode: airport.airportCode,
    }));
    setArrivalQuery(airport.name);
    setShowArrivalSuggestions(false);
  };

  return (
    <DetailFormContainer>
      <h1 className="pt-3 text-3xl detail-form-title">여행 상세 내용</h1>
      <hr className="my-4 custom-hr" />

      <form action="">
        <Table>
          <tbody>
            {/* 여행 이름 (수정 불가) */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                여행 이름
              </td>
              <td className="py-2">
                <input
                  id="name"
                  name="name"
                  value={proposalData.name || ''}
                  onChange={handleChange}
                  type="text"
                  disabled
                  className="w-full p-2 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </td>
            </tr>

            {/* 여행 일정 (수정 불가) */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                여행 일정
              </td>
              <td className="py-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {/* <label htmlFor="startDate" className="mr-2">
                      시작일
                    </label> */}
                    <DatePicker
                      id="startDate"
                      selected={getDateValue('startDate')}
                      onChange={handleDateChange('startDate')}
                      dateFormat="yyyy/MM/dd"
                      minDate={new Date()}
                      locale={ko}
                      placeholderText="yyyy/MM/dd"
                      disabled
                      className="p-2 bg-gray-100 border rounded"
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="endDate" className="mr-4">
                      ~
                    </label>
                    <DatePicker
                      id="endDate"
                      selected={getDateValue('endDate')}
                      onChange={handleDateChange('endDate')}
                      dateFormat="yyyy/MM/dd"
                      minDate={getDateValue('startDate') || new Date()}
                      locale={ko}
                      placeholderText="yyyy/MM/dd"
                      disabled
                      className="p-2 bg-gray-100 border rounded"
                    />
                  </div>
                </div>
              </td>
            </tr>

            {/* 항공사 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                항공사
              </td>
              <td className="py-2">
                <input
                  id="airline"
                  name="airline"
                  type="text"
                  value={proposalData.airline || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </td>
            </tr>

            {/* 공항 정보 - 출발 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                출발 공항 선택
              </td>
              <td className="py-2">
                <div className="relative">
                  <input
                    id="departureAirportName"
                    name="departureAirportName"
                    type="text"
                    placeholder="출발 공항 검색"
                    value={departureQuery}
                    onChange={(e) => {
                      setDepartureQuery(e.target.value);
                      setShowDepartureSuggestions(true);
                      // 입력 시 코드 초기화
                      setProposalData((prev) => ({
                        ...prev,
                        departureAirportName: e.target.value,
                        departureAirportCode: '',
                      }));
                    }}
                    onFocus={() => setShowDepartureSuggestions(true)}
                    autoComplete="off"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {showDepartureSuggestions && departureQuery && (
                    <ul className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg max-h-40">
                      {filteredDepartureAirports.map((airport) => (
                        <li
                          key={airport.airportCode}
                          onClick={() => handleSelectDepartureAirport(airport)}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {airport.name} ({airport.airportCode})
                        </li>
                      ))}
                      {filteredDepartureAirports.length === 0 && (
                        <li className="p-2 text-gray-500">검색 결과 없음</li>
                      )}
                    </ul>
                  )}
                </div>
              </td>
            </tr>

            {/* 공항 정보 - 도착 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                도착 공항 선택
              </td>
              <td className="py-2">
                <div className="relative">
                  <input
                    id="arrivalAirportName"
                    name="arrivalAirportName"
                    type="text"
                    placeholder="도착 공항 검색"
                    value={arrivalQuery}
                    onChange={(e) => {
                      setArrivalQuery(e.target.value);
                      setShowArrivalSuggestions(true);
                      setProposalData((prev) => ({
                        ...prev,
                        arrivalAirportName: e.target.value,
                        arrivalAirportCode: '',
                      }));
                    }}
                    onFocus={() => setShowArrivalSuggestions(true)}
                    autoComplete="off"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {showArrivalSuggestions && arrivalQuery && (
                    <ul className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg max-h-40">
                      {filteredArrivalAirports.map((airport) => (
                        <li
                          key={airport.airportCode}
                          onClick={() => handleSelectArrivalAirport(airport)}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {airport.name} ({airport.airportCode})
                        </li>
                      ))}
                      {filteredArrivalAirports.length === 0 && (
                        <li className="p-2 text-gray-500">검색 결과 없음</li>
                      )}
                    </ul>
                  )}
                </div>
              </td>
            </tr>

            {/* 항공편 정보 - 출발 항공 (탑승/도착일시 한 줄 배치) */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                출발 항공편
              </td>
              <td className="py-2">
                <div className="flex items-center gap-4">
                  {/* 탑승 일시 */}
                  <div className="flex flex-col">
                    <DatePicker
                      id="startDateBoardingTime"
                      selected={getDateValue('startDateBoardingTime')}
                      onChange={handleDateChange('startDateBoardingTime')}
                      dateFormat="yyyy/MM/dd HH:mm"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      minDate={new Date()}
                      locale={ko}
                      placeholderText="탑승 일시"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  {/* 도착 일시 */}
                  <div className="flex flex-col">
                    <DatePicker
                      id="startDateArrivalTime"
                      selected={getDateValue('startDateArrivalTime')}
                      onChange={handleDateChange('startDateArrivalTime')}
                      dateFormat="yyyy/MM/dd HH:mm"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      minDate={
                        getDateValue('startDateBoardingTime') || new Date()
                      }
                      minTime={
                        getDateValue('startDateBoardingTime') &&
                        getDateValue('startDateArrivalTime') &&
                        isSameDay(
                          getDateValue('startDateBoardingTime'),
                          getDateValue('startDateArrivalTime'),
                        )
                          ? addMinutes(getDateValue('startDateBoardingTime'), 5)
                          : set(new Date(), {
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                              milliseconds: 0,
                            })
                      }
                      maxTime={
                        getDateValue('startDateArrivalTime')
                          ? set(getDateValue('startDateArrivalTime'), {
                              hours: 23,
                              minutes: 59,
                              seconds: 59,
                              milliseconds: 999,
                            })
                          : set(new Date(), {
                              hours: 23,
                              minutes: 59,
                              seconds: 59,
                              milliseconds: 999,
                            })
                      }
                      locale={ko}
                      placeholderText="도착 일시"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </td>
            </tr>

            {/* 항공편 정보 - 도착 항공 (탑승/도착일시 한 줄 배치) */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                도착 항공편
              </td>
              <td className="py-2">
                <div className="flex items-center gap-4">
                  {/* 탑승 일시 */}
                  <div className="flex flex-col">
                    <DatePicker
                      id="endDateBoardingTime"
                      selected={getDateValue('endDateBoardingTime')}
                      onChange={handleDateChange('endDateBoardingTime')}
                      dateFormat="yyyy/MM/dd HH:mm"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      minDate={new Date()}
                      locale={ko}
                      placeholderText="탑승 일시"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  {/* 도착 일시 - 필드명 수정 */}
                  <div className="flex flex-col">
                    <DatePicker
                      id="endDateArrivalTime"
                      selected={getDateValue('endDateArrivalTime')}
                      onChange={handleDateChange('endDateArrivalTime')}
                      dateFormat="yyyy/MM/dd HH:mm"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={5}
                      minDate={
                        getDateValue('endDateBoardingTime') || new Date()
                      }
                      minTime={
                        getDateValue('endDateBoardingTime') &&
                        getDateValue('endDateArrivalTime') &&
                        isSameDay(
                          getDateValue('endDateBoardingTime'),
                          getDateValue('endDateArrivalTime'),
                        )
                          ? addMinutes(getDateValue('endDateBoardingTime'), 5)
                          : set(new Date(), {
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                              milliseconds: 0,
                            })
                      }
                      maxTime={
                        getDateValue('endDateArrivalTime')
                          ? set(getDateValue('endDateArrivalTime'), {
                              hours: 23,
                              minutes: 59,
                              seconds: 59,
                              milliseconds: 999,
                            })
                          : set(new Date(), {
                              hours: 23,
                              minutes: 59,
                              seconds: 59,
                              milliseconds: 999,
                            })
                      }
                      locale={ko}
                      placeholderText="도착 일시"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </td>
            </tr>

            {/* 예약금 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                예약금
              </td>
              <td className="py-2">
                <CurrencyInput
                  id="deposit"
                  name="deposit"
                  placeholder="예약금을 입력하세요"
                  value={proposalData.deposit}
                  decimalScale={2}
                  prefix="₩"
                  onValueChange={(value) =>
                    setProposalData((prev) => ({
                      ...prev,
                      deposit: value ? parseFloat(value) : 0,
                    }))
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </td>
            </tr>

            {/* 최소 인원 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                최소인원
              </td>
              <td className="py-2">
                <input
                  id="minPeople"
                  name="minPeople"
                  type="number"
                  min="1"
                  step="1"
                  value={proposalData.minPeople}
                  onChange={handleNumberChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </td>
            </tr>

            {/* 가이드 여부 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                가이드 여부
              </td>
              <td className="py-2">
                <input
                  id="guideIncluded"
                  name="guideIncluded"
                  type="checkbox"
                  checked={proposalData.guideIncluded ?? false}
                  onChange={(e) =>
                    setProposalData((prev) => ({
                      ...prev,
                      guideIncluded: e.target.checked,
                    }))
                  }
                  className="w-5 h-5"
                />
              </td>
            </tr>

            {/* 여행자 보험 포함 여부 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                여행자 보험 포함 여부
              </td>
              <td className="py-2">
                <input
                  id="insuranceIncluded"
                  name="insuranceIncluded"
                  type="checkbox"
                  checked={proposalData.insuranceIncluded ?? false}
                  onChange={(e) =>
                    setProposalData((prev) => ({
                      ...prev,
                      insuranceIncluded: e.target.checked,
                    }))
                  }
                  className="w-5 h-5"
                />
              </td>
            </tr>

            {/* 상품 소개 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                상품 소개
              </td>
              <td className="py-2">
                <input
                  id="productIntroduction"
                  name="productIntroduction"
                  type="text"
                  value={proposalData.productIntroduction || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </td>
            </tr>

            {/* 취소/환불정책 */}
            <tr>
              <td className="py-2" style={{ width: '150px' }}>
                취소/환불정책
              </td>
              <td className="py-2">
                <input
                  id="refundPolicy"
                  name="refundPolicy"
                  type="text"
                  value={proposalData.refundPolicy || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </form>
    </DetailFormContainer>
  );
};

export default DetailForm;
