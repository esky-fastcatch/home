
import React, { useState, useEffect } from "react";
import { Phone, FileText, Search, MapPin, Calendar, Edit, X, Check, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Reservation } from "@/api/entities";
import { Badge } from "@/components/ui/badge"; // Added Badge import

export default function MyReservations() {
  const { toast } = useToast();
  const [searchType, setSearchType] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  // const [timePickerOpen, setTimePickerOpen] = useState(false); // Removed as manual input
  const [reservationOpenDatePickerOpen, setReservationOpenDatePickerOpen] = useState(false);
  const [showSecondChoice, setShowSecondChoice] = useState(false);
  const [date2PickerOpen, setDate2PickerOpen] = useState(false);
  // const [time2PickerOpen, setTime2PickerOpen] = useState(false); // Removed as manual input
  const [reservationOpenDate2PickerOpen, setReservationOpenDate2PickerOpen] = useState(false);
  const [deathDatePickerOpen, setDeathDatePickerOpen] = useState(false);

  const crematoriumsByRegion = {
    gangwon: [
      { value: "donghae-samcheok", label: "동해삼척 공동화장장(승화원)" },
      { value: "sokcho", label: "속초시승화원" },
      { value: "solhyang", label: "솔향하늘길" },
      { value: "wonju", label: "원주추모공원 화장장" },
      { value: "inje", label: "인제 하늘내린도리안" },
      { value: "jeongseon", label: "정선하늘터" },
      { value: "chuncheon", label: "춘천안식원" },
      { value: "taebaek", label: "태백시화장장" }
    ],
    gyeonggi: [
      { value: "seongnam", label: "성남시장례문화사업소" },
      { value: "suwon", label: "수원시연화장" },
      { value: "yongin", label: "용인 평온의 숲" },
      { value: "hwaseong", label: "화성 함백산추모공원" }
    ],
    gyeongnam: [
      { value: "goseong", label: "고성군공설화장장" },
      { value: "gimhae", label: "김해추모의공원" },
      { value: "namhae", label: "남해추모누리영화원" },
      { value: "miryang", label: "밀양시공설화장시설" },
      { value: "sacheon", label: "사천시 누리원(화장시설)" },
      { value: "jinju", label: "진주시안락공원" },
      { value: "changwon-masan", label: "창원시립마산화장장" },
      { value: "changwon-sangbok", label: "창원시립상복공원" },
      { value: "tongyeong", label: "통영시추모공원" },
      { value: "haman", label: "함안하늘공원" }
    ],
    gyeongbuk: [
      { value: "gyeongju", label: "경주하늘마루관리사무소" },
      { value: "gumi", label: "구미시추모공원" },
      { value: "gimcheon", label: "김천시립추모공원" },
      { value: "mungyeong", label: "문경예송원" },
      { value: "sangju", label: "상주시승천원" },
      { value: "andong", label: "안동장사문화공원" },
      { value: "yeongju", label: "영주시화장장" },
      { value: "ulleung", label: "울릉하늘섬공원" },
      { value: "uljin", label: "울진군립추모원" },
      { value: "uiseong", label: "의성군공설화장장" },
      { value: "pohang-guryongpo", label: "포항시립구룡포화장장" },
      { value: "pohang-uhyeon", label: "포항시립우현화장장" }
    ],
    gwangju: [
      { value: "gwangju-yeongnak", label: "광주시영락공원" }
    ],
    daegu: [
      { value: "daegu-myeongbok", label: "대구명복공원" }
    ],
    daejeon: [
      { value: "daejeon-jeongsuwon", label: "대전시정수원" }
    ],
    busan: [
      { value: "busan-yeongnak", label: "부산영락공원" }
    ],
    seoul: [
      { value: "seoul-seunghwawon", label: "서울시립승화원" },
      { value: "seoul-memorial", label: "서울추모공원" }
    ],
    sejong: [
      { value: "sejong-eunhasu", label: "세종시은하수공원" }
    ],
    ulsan: [
      { value: "ulsan-sky", label: "울산하늘공원" }
    ],
    incheon: [
      { value: "incheon-family", label: "인천가족공원" }
    ],
    jeonnam: [
      { value: "gwangyang", label: "광양시화장장" },
      { value: "sorokdo", label: "국립소록도병원화장장" },
      { value: "namdo", label: "남도광역추모공원" },
      { value: "mokpo", label: "목포추모공원" },
      { value: "suncheon", label: "순천시립 추모공원" },
      { value: "yeosu", label: "여수시 영락공원 승화원" },
      { value: "cheonggye", label: "재단법인 청계원" }
    ],
    jeonbuk: [
      { value: "gunsan", label: "군산시승화원" },
      { value: "namwon", label: "남원시승화원" },
      { value: "seonam", label: "서남권추모공원" },
      { value: "iksan", label: "익산하늘공원정수원" },
      { value: "jeonju", label: "전주시승화원" }
    ],
    jeju: [
      { value: "jeju-yangji", label: "제주특별자치도 양지공원" }
    ],
    chungnam: [
      { value: "gongju", label: "공주나래원" },
      { value: "cheonan", label: "천안도시공사 천안추모공원" },
      { value: "hongseong", label: "홍성군공공시설관리사업소" }
    ],
    chungbuk: [
      { value: "jecheon", label: "제천시영원한쉼터" },
      { value: "cheongju", label: "청주시목련공원" },
      { value: "chungju", label: "충주시공설화장장 하늘나라" }
    ]
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const parts = [];

    if (numbers.length > 0) {
      parts.push(numbers.slice(0, 3));
    }
    if (numbers.length > 3) {
      parts.push(numbers.slice(3, 7));
    }
    if (numbers.length > 7) {
      parts.push(numbers.slice(7, 11));
    }

    return parts.join('-');
  };

  const formatTime = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const parts = [];
    
    if (numbers.length > 0) {
      parts.push(numbers.slice(0, 2));
    }
    if (numbers.length > 2) {
      parts.push(numbers.slice(2, 4));
    }
    if (numbers.length > 4) {
      parts.push(numbers.slice(4, 6));
    }
    
    return parts.join(':');
  };

  const formatReservationNumber = (value) => {
    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '');
    const parts = [];

    if (alphanumeric.length > 0) {
      parts.push(alphanumeric.slice(0, 8));
    }
    if (alphanumeric.length > 8) {
      parts.push(alphanumeric.slice(8, 12));
    }
    if (alphanumeric.length > 12) {
      parts.push(alphanumeric.slice(12, 16));
    }

    return parts.join('-');
  };

  const formatResidentNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    let formatted = '';

    if (numbers.length <= 6) {
      formatted = numbers;
    } else {
      formatted = `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
    }
    return formatted;
  };

  const formatDateWithDay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return format(date, "yyyy-MM-dd (EEE)", { locale: ko });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const getServiceTypeBadgeColor = (serviceType) => {
    switch (serviceType) {
      case "일반시신 신규예약":
      case "일반시신 예약변경":
        return "bg-blue-100 text-blue-700";
      case "개장유골 신규예약":
      case "개장유골 예약변경":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "접수완료":
        return "bg-yellow-100 text-yellow-700";
      case "예약중":
        return "bg-blue-100 text-blue-700";
      case "예약완료":
        return "bg-green-100 text-green-700";
      case "예약실패":
        return "bg-red-100 text-red-700";
      case "예약취소":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSuccessBadgeColor = (successStatus) => {
    switch (successStatus) {
      case "성공":
        return "bg-green-100 text-green-700";
      case "실패":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const performSearch = async (type, value) => {
    if (!value) {
      toast({
        title: "입력 오류",
        description: type === "phone" ? "전화번호를 입력해주세요" : "예약번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    try {
      let results = [];

      if (type === "reservation") {
        results = await Reservation.filter({ reservationNumber: value });
      } else if (type === "phone") {
        results = await Reservation.filter({ applicantPhoneNumber: value });
      }

      const formattedResults = results.map(reservation => ({
        id: reservation.id,
        processingStatus: reservation.processingStatus || "접수완료", // Explicitly keep processingStatus
        successStatus: reservation.successStatus, // Explicitly keep successStatus
        serviceType: reservation.serviceType,
        applicationDate: format(new Date(reservation.created_date), "yyyy-MM-dd HH:mm"), // Changed to created_date and added time
        reservationNumber: reservation.reservationNumber,
        phone: reservation.applicantPhoneNumber,
        crematorium: reservation.crematorium,
        desiredDate: formatDateWithDay(reservation.desiredDate),
        desiredSession: reservation.desiredSession,
        applicantName: reservation.applicantName,
        applicantResidentNumber: reservation.applicantResidentNumber,
        applicantTelecom: reservation.applicantTelecom,
        region: reservation.region,
        reservationTime: reservation.reservationTime,
        reservationOpenDate: reservation.reservationOpenDate,
        districtType: reservation.districtType,
        region2: reservation.region2,
        crematorium2: reservation.crematorium2,
        desiredDate2: reservation.desiredDate2 ? formatDateWithDay(reservation.desiredDate2) : null,
        desiredSession2: reservation.desiredSession2,
        reservationTime2: reservation.reservationTime2,
        reservationOpenDate2: reservation.reservationOpenDate2,
        districtType2: reservation.districtType2,
        howDidYouKnow: reservation.howDidYouKnow,
        additionalRequest: reservation.additionalRequest,
        applicantAddress: reservation.applicantAddress,
        relationshipToDeceased: reservation.relationshipToDeceased,
        deceasedNationality: reservation.deceasedNationality,
        deceasedName: reservation.deceasedName,
        deceasedResidentNumber: reservation.deceasedResidentNumber,
        deceasedAddress: reservation.deceasedAddress,
        deathDate: reservation.deathDate,
        deathTime: reservation.deathTime,
        funeralLocation: reservation.funeralLocation,
        funeralLocationContact: reservation.funeralLocationContact,
        deceasedManagementNumber: reservation.deceasedManagementNumber,
        coDeceasedName: reservation.coDeceasedName,
        coDeceasedManagementNumber: reservation.coDeceasedManagementNumber,
        created_date: reservation.created_date, // Added created_date for consistency, although applicationDate is derived from it now
      }));

      setSearchResults(formattedResults);
      setHasSearched(true);
    } catch (error) {
      console.error("Reservation search failed:", error);
      toast({
        title: "조회 실패",
        description: "예약 정보 조회 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationNumber = urlParams.get('reservationNumber');

    if (reservationNumber) {
      const formattedResNum = formatReservationNumber(reservationNumber);
      setSearchType("reservation");
      setSearchValue(formattedResNum);
      performSearch("reservation", formattedResNum);
    }
  }, []);

  const handleSearch = () => {
    performSearch(searchType, searchValue);
  };

  const handleInputChange = (value) => {
    if (searchType === "phone") {
      setSearchValue(formatPhoneNumber(value));
    } else {
      setSearchValue(formatReservationNumber(value));
    }
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);

    const dateOnly = reservation.desiredDate.includes('(')
      ? reservation.desiredDate.split(' ')[0]
      : reservation.desiredDate;

    const sessionNumber = reservation.desiredSession ? reservation.desiredSession.toString().replace(/[^0-9]/g, '') : "";

    const hasSecondChoice = !!(reservation.region2 || reservation.crematorium2 || reservation.desiredDate2 || reservation.desiredSession2);
    setShowSecondChoice(hasSecondChoice);

    const formData = {
      reservationNumber: reservation.reservationNumber,
      applicantName: reservation.applicantName || "",
      applicantResidentNumber: reservation.applicantResidentNumber || "",
      applicantTelecom: reservation.applicantTelecom || "",
      phone: reservation.phone,
      region: reservation.region || "",
      crematorium: reservation.crematorium,
      desiredDate: dateOnly,
      desiredSession: sessionNumber,
      reservationOpenDate: reservation.reservationOpenDate ? format(new Date(reservation.reservationOpenDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      reservationTime: reservation.reservationTime || "00:00:00",
      region2: reservation.region2 || "",
      crematorium2: reservation.crematorium2 || "",
      desiredDate2: reservation.desiredDate2 ? reservation.desiredDate2.split(' ')[0] : format(new Date(), "yyyy-MM-dd"),
      desiredSession2: reservation.desiredSession2,
      reservationOpenDate2: reservation.reservationOpenDate2 ? format(new Date(reservation.reservationOpenDate2), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      reservationTime2: reservation.reservationTime2 || "00:00:00",
      howDidYouKnow: reservation.howDidYouKnow || "",
      additionalRequest: reservation.additionalRequest || "",
      // Initialize these to empty strings, they will be overwritten if applicable below
      applicantAddress: "", 
      relationshipToDeceased: "",
    };

    if (reservation.serviceType === "일반시신 예약변경" || reservation.serviceType === "개장유골 예약변경") {
      formData.districtType = reservation.districtType || "";
      formData.districtType2 = reservation.districtType2 || "";
    }

    if (reservation.serviceType === "일반시신 신규예약") {
      formData.applicantAddress = reservation.applicantAddress || "";
      formData.relationshipToDeceased = reservation.relationshipToDeceased || "";
      formData.deceasedNationality = reservation.deceasedNationality || "국내";
      formData.deceasedName = reservation.deceasedName || "";
      formData.deceasedResidentNumber = reservation.deceasedResidentNumber || "";
      formData.deceasedAddress = reservation.deceasedAddress || "";
      formData.deathDate = reservation.deathDate ? reservation.deathDate.split(' ')[0] : format(new Date(), "yyyy-MM-dd");
      formData.deathTime = reservation.deathTime ? reservation.deathTime.substring(0, 5) : "00:00";
      formData.funeralLocation = reservation.funeralLocation || "";
      formData.funeralLocationContact = reservation.funeralLocationContact || "";
    } else if (reservation.serviceType === "개장유골 신규예약") {
      formData.applicantAddress = reservation.applicantAddress || "";
      formData.relationshipToDeceased = reservation.relationshipToDeceased || "";
      formData.deceasedName = reservation.deceasedName || "";
      formData.deceasedManagementNumber = reservation.deceasedManagementNumber || "";
      formData.coDeceasedName = reservation.coDeceasedName || "";
      formData.coDeceasedManagementNumber = reservation.coDeceasedManagementNumber || "";
      formData.funeralLocation = reservation.funeralLocation || "";
    }

    setEditFormData(formData);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedReservation || !selectedReservation.id) {
        throw new Error("Selected reservation or its ID is missing.");
      }

      const updateData = {
        applicantName: editFormData.applicantName,
        applicantResidentNumber: editFormData.applicantResidentNumber,
        applicantTelecom: editFormData.applicantTelecom,
        applicantPhoneNumber: editFormData.phone,
        region: editFormData.region,
        crematorium: editFormData.crematorium,
        desiredDate: editFormData.desiredDate,
        desiredSession: editFormData.desiredSession,
        reservationOpenDate: editFormData.reservationOpenDate,
        reservationTime: editFormData.reservationTime,
        region2: showSecondChoice ? (editFormData.region2 || null) : null,
        crematorium2: showSecondChoice ? (editFormData.crematorium2 || null) : null,
        desiredDate2: showSecondChoice ? (editFormData.desiredDate2 || null) : null,
        desiredSession2: showSecondChoice ? (editFormData.desiredSession2 || null) : null,
        reservationOpenDate2: showSecondChoice ? (editFormData.reservationOpenDate2 || null) : null,
        reservationTime2: showSecondChoice ? (editFormData.reservationTime2 || null) : null,
        howDidYouKnow: editFormData.howDidYouKnow,
        additionalRequest: editFormData.additionalRequest
      };

      if (selectedReservation.serviceType === "일반시신 예약변경" || selectedReservation.serviceType === "개장유골 예약변경") {
        updateData.districtType = editFormData.districtType || null;
        updateData.districtType2 = showSecondChoice ? (editFormData.districtType2 || null) : null;
      }

      if (selectedReservation.serviceType === "일반시신 신규예약") {
        updateData.applicantAddress = editFormData.applicantAddress;
        updateData.relationshipToDeceased = editFormData.relationshipToDeceased;
        updateData.deceasedNationality = editFormData.deceasedNationality;
        updateData.deceasedName = editFormData.deceasedName;
        updateData.deceasedResidentNumber = editFormData.deceasedResidentNumber;
        updateData.deceasedAddress = editFormData.deceasedAddress;
        updateData.deathDate = editFormData.deathDate;
        updateData.deathTime = editFormData.deathTime;
        updateData.funeralLocation = editFormData.funeralLocation;
        updateData.funeralLocationContact = editFormData.funeralLocationContact;
      } else if (selectedReservation.serviceType === "개장유골 신규예약") {
        updateData.applicantAddress = editFormData.applicantAddress;
        updateData.relationshipToDeceased = editFormData.relationshipToDeceased;
        updateData.deceasedName = editFormData.deceasedName;
        updateData.deceasedManagementNumber = editFormData.deceasedManagementNumber;
        updateData.coDeceasedName = editFormData.coDeceasedName || null;
        updateData.coDeceasedManagementNumber = editFormData.coDeceasedManagementNumber || null;
        updateData.funeralLocation = editFormData.funeralLocation;
      }

      await Reservation.update(selectedReservation.id, updateData);

      toast({
        title: "수정 완료",
        description: "예약 정보가 성공적으로 수정되었습니다.",
      });
      setEditModalOpen(false);
      performSearch(searchType, searchValue);
    } catch (error) {
      console.error("Reservation update failed:", error);
      toast({
        title: "수정 실패",
        description: `예약 정보 수정 중 오류가 발생했습니다. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      if (!selectedReservation || !selectedReservation.id) {
        throw new Error("Selected reservation or its ID is missing.");
      }

      await Reservation.delete(selectedReservation.id);

      toast({
        title: "예약 취소 완료",
        description: "예약이 성공적으로 취소되었습니다.",
      });
      setCancelModalOpen(false);
      setSearchResults(searchResults.filter(r => r.id !== selectedReservation.id));
    } catch (error) {
      console.error("Reservation cancellation failed:", error);
      toast({
        title: "취소 실패",
        description: `예약 취소 중 오류가 발생했습니다. ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'applicantResidentNumber' || field === 'deceasedResidentNumber') {
      formattedValue = formatResidentNumber(value);
    } else if (field === 'phone' || field === 'funeralLocationContact') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'reservationTime' || field === 'reservationTime2') {
      formattedValue = formatTime(value);
    } else if (field === 'deathTime') {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      if (cleanedValue.length > 2) {
        formattedValue = `${cleanedValue.slice(0, 2)}:${cleanedValue.slice(2, 4)}`;
      } else {
        formattedValue = cleanedValue;
      }
    } else if (field === 'region') {
      setEditFormData(prev => ({ ...prev, [field]: value, crematorium: "" }));
      return;
    } else if (field === 'region2') {
      setEditFormData(prev => ({ ...prev, [field]: value, crematorium2: "" }));
      return;
    }

    setEditFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleEditDateSelect = (field, date) => {
    if (date) {
      handleEditInputChange(field, format(date, "yyyy-MM-dd"));
      if (field === 'desiredDate') setDatePickerOpen(false);
      if (field === 'desiredDate2') setDate2PickerOpen(false);
      if (field === 'reservationOpenDate') setReservationOpenDatePickerOpen(false);
      if (field === 'reservationOpenDate2') setReservationOpenDate2PickerOpen(false);
      if (field === 'deathDate') setDeathDatePickerOpen(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-6 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            예약 조회
          </h1>
          <p className="text-base text-gray-600">
            전화번호 또는 예약번호로<br className="sm:hidden" />
            예약 상태를 확인하실 수 있습니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            예약 정보 검색
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              onClick={() => {
                setSearchType("phone");
                setSearchValue("");
              }}
              className={`w-full h-12 text-base font-medium justify-start px-4 ${
                searchType === "phone"
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200"
              }`}
            >
              {searchType === "phone" && <Check className="w-5 h-5 mr-2" />}
              <Phone className="w-5 h-5 mr-2" />
              전화번호로 조회
            </Button>
            <Button
              onClick={() => {
                setSearchType("reservation");
                setSearchValue("");
              }}
              className={`w-full h-12 text-base font-medium justify-start px-4 ${
                searchType === "reservation"
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200"
              }`}
            >
              {searchType === "reservation" && <Check className="w-5 h-5 mr-2" />}
              <FileText className="w-5 h-5 mr-2" />
              예약번호로 조회
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="block text-base font-medium text-gray-700 mb-2">
                {searchType === "phone" ? "전화번호" : "예약번호"}
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder={searchType === "phone" ? "010-1234-5678" : "OOOOOOOO-OOOO-OOOO"}
                  value={searchValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full sm:w-auto h-12 text-base"
                  maxLength={searchType === "phone" ? 13 : 18}
                />
                <Button
                  onClick={handleSearch}
                  className="w-full sm:w-auto h-12 px-8 bg-blue-500 hover:bg-blue-600 text-base font-medium"
                >
                  <Search className="w-5 h-5 mr-2" />
                  조회
                </Button>
              </div>
            </div>
          </div>
        </div>

        {hasSearched && (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadgeColor(reservation.processingStatus)}>
                        {reservation.processingStatus}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">신청일</p>
                      <p className="text-sm font-medium text-gray-700">
                        {format(new Date(reservation.created_date), "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">신청자 성명</p>
                        <p className="text-base font-medium text-gray-900">
                          {reservation.applicantName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">신청자 전화번호</p>
                        <p className="text-base font-medium text-gray-900">
                          {reservation.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">예약번호</p>
                        <p className="text-base font-medium text-gray-900">
                          {reservation.reservationNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">화장장 명</p>
                        <p className="text-base font-medium text-gray-900">
                          {reservation.crematorium}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">희망 일정</p>
                        <p className="text-base font-medium text-gray-900">
                          {reservation.desiredDate} {reservation.desiredSession}회차
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">서비스 유형</p>
                        <p className="text-base font-medium text-gray-900">
                          {reservation.serviceType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleEditReservation(reservation)}
                      variant="outline"
                      className="flex-1 h-11 text-base font-medium border-gray-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      상세/수정
                    </Button>
                    <Button
                      onClick={() => handleCancelClick(reservation)}
                      className="flex-1 h-11 text-base font-medium bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      예약 취소
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-gray-500">조회된 예약 정보가 없습니다.</p>
              </div>
            )}
          </div>
        )}

        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent
            className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto w-[calc(100vw-2rem)] sm:w-full mt-8 sm:mt-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">예약 정보 수정</DialogTitle>
              <DialogDescription>
                수정할 정보를 입력하고 저장 버튼을 눌러주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <div className="bg-blue-50 rounded-lg px-4 py-3 mb-4">
                  <h3 className="text-base font-semibold text-blue-900">신청자 정보</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-reservationNumber" className="text-sm font-medium mb-2 block">
                      예약번호
                    </Label>
                    <Input
                      id="edit-reservationNumber"
                      value={editFormData.reservationNumber || ""}
                      className="h-11"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-applicantName" className="text-sm font-medium mb-2 block">
                      신청자 이름
                    </Label>
                    <Input
                      id="edit-applicantName"
                      value={editFormData.applicantName || ""}
                      onChange={(e) => handleEditInputChange("applicantName", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-applicantResidentNumber" className="text-sm font-medium mb-2 block">
                      주민번호
                    </Label>
                    <Input
                      id="edit-applicantResidentNumber"
                      value={editFormData.applicantResidentNumber || ""}
                      onChange={(e) => handleEditInputChange("applicantResidentNumber", e.target.value)}
                      className="h-11"
                      maxLength={8}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-applicantTelecom" className="text-sm font-medium mb-2 block">
                      통신사
                    </Label>
                    <Select
                      value={editFormData.applicantTelecom || ""}
                      onValueChange={(value) => handleEditInputChange("applicantTelecom", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="통신사를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="skt">SKT</SelectItem>
                        <SelectItem value="kt">KT</SelectItem>
                        <SelectItem value="lgu">LG U+</SelectItem>
                        <SelectItem value="skt-mvno">SKT 알뜰폰</SelectItem>
                        <SelectItem value="kt-mvno">KT 알뜰폰</SelectItem>
                        <SelectItem value="lgu-mvno">LG U+ 알뜰폰</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-phone" className="text-sm font-medium mb-2 block">
                      연락처
                    </Label>
                    <Input
                      id="edit-phone"
                      value={editFormData.phone || ""}
                      onChange={(e) => handleEditInputChange("phone", e.target.value)}
                      className="h-11"
                      maxLength={13}
                    />
                  </div>
                  {(selectedReservation?.serviceType === "일반시신 신규예약" || selectedReservation?.serviceType === "개장유골 신규예약") && (
                    <>
                      <div>
                        <Label htmlFor="edit-applicantAddress" className="text-sm font-medium mb-2 block">
                          신청자 주소
                        </Label>
                        <Input
                          id="edit-applicantAddress"
                          value={editFormData.applicantAddress || ""}
                          onChange={(e) => handleEditInputChange("applicantAddress", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-relationshipToDeceased" className="text-sm font-medium mb-2 block">
                          고인과의 관계
                        </Label>
                        <Input
                          id="edit-relationshipToDeceased"
                          value={editFormData.relationshipToDeceased || ""}
                          onChange={(e) => handleEditInputChange("relationshipToDeceased", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedReservation?.serviceType === "일반시신 신규예약" && (
                <>
                  <div className="py-3">
                    <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm" />
                  </div>
                  <div>
                    <div className="bg-purple-50 rounded-lg px-4 py-3 mb-4">
                      <h3 className="text-base font-semibold text-purple-900">고인 정보</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">국적 구분</Label>
                        <RadioGroup
                          value={editFormData.deceasedNationality || "국내"}
                          onValueChange={(value) => handleEditInputChange("deceasedNationality", value)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="국내" id="edit-nationality-domestic" />
                            <Label htmlFor="edit-nationality-domestic" className="font-normal cursor-pointer">국내</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="국외" id="edit-nationality-foreign" />
                            <Label htmlFor="edit-nationality-foreign" className="font-normal cursor-pointer">국외</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-deceasedName" className="text-sm font-medium mb-2 block">
                            고인 성명
                          </Label>
                          <Input
                            id="edit-deceasedName"
                            value={editFormData.deceasedName || ""}
                            onChange={(e) => handleEditInputChange("deceasedName", e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-deceasedResidentNumber" className="text-sm font-medium mb-2 block">
                            고인 주민번호
                          </Label>
                          <Input
                            id="edit-deceasedResidentNumber"
                            value={editFormData.deceasedResidentNumber || ""}
                            onChange={(e) => handleEditInputChange("deceasedResidentNumber", e.target.value)}
                            className="h-11"
                            maxLength={14}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="edit-deceasedAddress" className="text-sm font-medium mb-2 block">
                          고인 주소
                        </Label>
                        <Input
                          id="edit-deceasedAddress"
                          value={editFormData.deceasedAddress || ""}
                          onChange={(e) => handleEditInputChange("deceasedAddress", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-deathDate" className="text-sm font-medium mb-2 block">
                          사망일자
                        </Label>
                        <Popover open={deathDatePickerOpen} onOpenChange={setDeathDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-11 justify-start text-left font-normal hover:bg-gray-50 transition-colors"
                            >
                              <span className="flex-1">
                                {editFormData.deathDate ? formatDateWithDay(editFormData.deathDate) : "년도-월-일"}
                              </span>
                              <CalendarIcon className="h-5 w-5 text-gray-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={editFormData.deathDate ? new Date(editFormData.deathDate) : undefined}
                              onSelect={(date) => handleEditDateSelect('deathDate', date)}
                              locale={ko}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="edit-deathTime" className="text-sm font-medium mb-2 block">
                          사망시간
                        </Label>
                        <Input
                          id="edit-deathTime"
                          value={editFormData.deathTime || ""}
                          onChange={(e) => handleEditInputChange("deathTime", e.target.value)}
                          className="h-11"
                          placeholder="예) 16:24"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-funeralLocation" className="text-sm font-medium mb-2 block">
                          장례장소
                        </Label>
                        <Input
                          id="edit-funeralLocation"
                          value={editFormData.funeralLocation || ""}
                          onChange={(e) => handleEditInputChange("funeralLocation", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-funeralLocationContact" className="text-sm font-medium mb-2 block">
                          장례장소 연락처
                        </Label>
                        <Input
                          id="edit-funeralLocationContact"
                          value={editFormData.funeralLocationContact || ""}
                          onChange={(e) => handleEditInputChange("funeralLocationContact", e.target.value)}
                          className="h-11"
                          maxLength={13}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedReservation?.serviceType === "개장유골 신규예약" && (
                <>
                  <div className="py-3">
                    <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm" />
                  </div>
                  <div>
                    <div className="bg-purple-50 rounded-lg px-4 py-3 mb-4">
                      <h3 className="text-base font-semibold text-purple-900">고인 정보</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-deceasedName" className="text-sm font-medium mb-2 block">
                          고인 성명
                        </Label>
                        <Input
                          id="edit-deceasedName"
                          value={editFormData.deceasedName || ""}
                          onChange={(e) => handleEditInputChange("deceasedName", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-deceasedManagementNumber" className="text-sm font-medium mb-2 block">
                          고인 개장신고 관리번호
                        </Label>
                        <Input
                          id="edit-deceasedManagementNumber"
                          value={editFormData.deceasedManagementNumber || ""}
                          onChange={(e) => handleEditInputChange("deceasedManagementNumber", e.target.value)}
                          className="h-11"
                          maxLength={16}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-coDeceasedName" className="text-sm font-medium mb-2 block">
                          합장자 성명
                        </Label>
                        <Input
                          id="edit-coDeceasedName"
                          value={editFormData.coDeceasedName || ""}
                          onChange={(e) => handleEditInputChange("coDeceasedName", e.target.value)}
                          className="h-11"
                          placeholder="(합장자가 있는 경우에만 입력)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-coDeceasedManagementNumber" className="text-sm font-medium mb-2 block">
                          합장자 개장신고 관리번호
                        </Label>
                        <Input
                          id="edit-coDeceasedManagementNumber"
                          value={editFormData.coDeceasedManagementNumber || ""}
                          onChange={(e) => handleEditInputChange("coDeceasedManagementNumber", e.target.value)}
                          className="h-11"
                          maxLength={16}
                          placeholder="(합장자가 있는 경우에만 입력)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-funeralLocation" className="text-sm font-medium mb-2 block">
                          장례장소
                        </Label>
                        <Input
                          id="edit-funeralLocation"
                          value={editFormData.funeralLocation || ""}
                          onChange={(e) => handleEditInputChange("funeralLocation", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="py-3">
                <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm" />
              </div>

              <div>
                <div className="bg-indigo-50 rounded-lg px-4 py-3 mb-4">
                  <h3 className="text-base font-semibold text-indigo-900">1순위 희망 화장 정보</h3>
                </div>
                <div className="space-y-4">
                  {(selectedReservation?.serviceType === "일반시신 예약변경" || selectedReservation?.serviceType === "개장유골 예약변경") && (
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        관내/관외 구분
                      </Label>
                      <RadioGroup
                        value={editFormData.districtType || ""}
                        onValueChange={(value) => handleEditInputChange("districtType", value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="관내" id="edit-district-in" />
                          <Label htmlFor="edit-district-in" className="font-normal cursor-pointer">관내</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="관외" id="edit-district-out" />
                          <Label htmlFor="edit-district-out" className="font-normal cursor-pointer">관외</Label>
                        </div>
                      </RadioGroup>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          예약하려는 화장장이 위치한 지역에 고인의 주민등록상 주소지가 있는 경우 <strong>관내</strong>. 그 외는 <strong>관외</strong>를 선택해주세요.
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="edit-region" className="text-sm font-medium mb-2 block">
                      지역 선택
                    </Label>
                    <Select
                      value={editFormData.region || ""}
                      onValueChange={(value) => handleEditInputChange("region", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="시, 도를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="seoul">서울특별시</SelectItem>
                        <SelectItem value="busan">부산광역시</SelectItem>
                        <SelectItem value="daegu">대구광역시</SelectItem>
                        <SelectItem value="incheon">인천광역시</SelectItem>
                        <SelectItem value="gwangju">광주광역시</SelectItem>
                        <SelectItem value="daejeon">대전광역시</SelectItem>
                        <SelectItem value="ulsan">울산광역시</SelectItem>
                        <SelectItem value="sejong">세종특별자치시</SelectItem>
                        <SelectItem value="gyeonggi">경기도</SelectItem>
                        <SelectItem value="gangwon">강원특별자치도</SelectItem>
                        <SelectItem value="chungbuk">충청북도</SelectItem>
                        <SelectItem value="chungnam">충청남도</SelectItem>
                        <SelectItem value="jeonbuk">전북특별자치도</SelectItem>
                        <SelectItem value="jeonnam">전라남도</SelectItem>
                        <SelectItem value="gyeongbuk">경상북도</SelectItem>
                        <SelectItem value="gyeongnam">경상남도</SelectItem>
                        <SelectItem value="jeju">제주특별자치도</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-crematorium" className="text-sm font-medium mb-2 block">
                      화장장
                    </Label>
                    <Select
                      value={editFormData.crematorium || ""}
                      onValueChange={(value) => handleEditInputChange("crematorium", value)}
                      disabled={!editFormData.region}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="지역을 먼저 선택하세요" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {(editFormData.region ? crematoriumsByRegion[editFormData.region] || [] : []).map((crematorium) => (
                          <SelectItem key={crematorium.value} value={crematorium.label}>
                            {crematorium.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">희망 화장 일정</Label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-11 justify-start text-left font-normal hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex-1">
                              {editFormData.desiredDate ? formatDateWithDay(editFormData.desiredDate) : "날짜 선택"}
                            </span>
                            <Calendar className="h-5 w-5 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={editFormData.desiredDate ? new Date(editFormData.desiredDate) : undefined}
                            onSelect={(date) => handleEditDateSelect('desiredDate', date)}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">희망 화장 회차</Label>
                      <Select
                        value={editFormData.desiredSession || ""}
                        onValueChange={(value) => handleEditInputChange("desiredSession", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="회차 선택" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num}회차
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-reservationOpenDate" className="text-sm font-medium mb-2 block">
                        예약 오픈 일자
                      </Label>
                      <Popover open={reservationOpenDatePickerOpen} onOpenChange={setReservationOpenDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-11 justify-start text-left font-normal hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex-1">
                              {editFormData.reservationOpenDate ? formatDateWithDay(editFormData.reservationOpenDate) : "년도-월-일"}
                            </span>
                            <Calendar className="h-5 w-5 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={editFormData.reservationOpenDate ? new Date(editFormData.reservationOpenDate) : undefined}
                            onSelect={(date) => handleEditDateSelect('reservationOpenDate', date)}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="edit-reservationTime" className="text-sm font-medium mb-2 block">
                        예약 오픈 시간
                      </Label>
                      <Input
                        id="edit-reservationTime"
                        placeholder="예) 09:00:00"
                        value={editFormData.reservationTime || ""}
                        onChange={(e) => handleEditInputChange("reservationTime", e.target.value)}
                        className="h-11"
                        maxLength={8}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {showSecondChoice && (
                <>
                  <div className="py-3">
                    <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-purple-50 rounded-lg px-4 py-3">
                        <h3 className="text-base font-semibold text-purple-900">2순위 희망 화장 정보</h3>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setShowSecondChoice(false);
                          setEditFormData(prev => ({
                            ...prev,
                            districtType2: "",
                            region2: "",
                            crematorium2: "",
                            desiredDate2: null,
                            desiredSession2: "",
                            reservationOpenDate2: null,
                            reservationTime2: "00:00:00"
                          }));
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        삭제
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(selectedReservation?.serviceType === "일반시신 예약변경" || selectedReservation?.serviceType === "개장유골 예약변경") && (
                        <div>
                          <Label className="text-sm font-medium mb-3 block">
                            관내/관외 구분
                          </Label>
                          <RadioGroup
                            value={editFormData.districtType2 || ""}
                            onValueChange={(value) => handleEditInputChange("districtType2", value)}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="관내" id="edit-district2-in" />
                              <Label htmlFor="edit-district2-in" className="font-normal cursor-pointer">관내</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="관외" id="edit-district2-out" />
                              <Label htmlFor="edit-district2-out" className="font-normal cursor-pointer">관외</Label>
                            </div>
                          </RadioGroup>
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-gray-700 leading-relaxed">
                              예약하려는 화장장이 위치한 지역에 고인의 주민등록상 주소지가 있는 경우 <strong>관내</strong>. 그 외는 <strong>관외</strong>를 선택해주세요.
                            </p>
                          </div>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="edit-region2" className="text-sm font-medium mb-2 block">
                          지역 선택
                        </Label>
                        <Select
                          value={editFormData.region2 || ""}
                          onValueChange={(value) => handleEditInputChange("region2", value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="시, 도를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            <SelectItem value="seoul">서울특별시</SelectItem>
                            <SelectItem value="busan">부산광역시</SelectItem>
                            <SelectItem value="daegu">대구광역시</SelectItem>
                            <SelectItem value="incheon">인천광역시</SelectItem>
                            <SelectItem value="gwangju">광주광역시</SelectItem>
                            <SelectItem value="daejeon">대전광역시</SelectItem>
                            <SelectItem value="ulsan">울산광역시</SelectItem>
                            <SelectItem value="sejong">세종특별자치시</SelectItem>
                            <SelectItem value="gyeonggi">경기도</SelectItem>
                            <SelectItem value="gangwon">강원특별자치도</SelectItem>
                            <SelectItem value="chungbuk">충청북도</SelectItem>
                            <SelectItem value="chungnam">충청남도</SelectItem>
                            <SelectItem value="jeonbuk">전북특별자치도</SelectItem>
                            <SelectItem value="jeonnam">전라남도</SelectItem>
                            <SelectItem value="gyeongbuk">경상북도</SelectItem>
                            <SelectItem value="gyeongnam">경상남도</SelectItem>
                            <SelectItem value="jeju">제주특별자치도</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-crematorium2" className="text-sm font-medium mb-2 block">
                          화장장
                        </Label>
                        <Select
                          value={editFormData.crematorium2 || ""}
                          onValueChange={(value) => handleEditInputChange("crematorium2", value)}
                          disabled={!editFormData.region2}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="지역을 먼저 선택하세요" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {(editFormData.region2 ? crematoriumsByRegion[editFormData.region2] || [] : []).map((crematorium) => (
                              <SelectItem key={crematorium.value} value={crematorium.label}>
                                {crematorium.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">희망 화장 일정</Label>
                          <Popover open={date2PickerOpen} onOpenChange={setDate2PickerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full h-11 justify-start text-left font-normal hover:bg-gray-50 transition-colors"
                              >
                                <span className="flex-1">
                                  {editFormData.desiredDate2 ? formatDateWithDay(editFormData.desiredDate2) : "날짜 선택"}
                                </span>
                                <Calendar className="h-5 w-5 text-gray-500" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={editFormData.desiredDate2 ? new Date(editFormData.desiredDate2) : undefined}
                                onSelect={(date) => handleEditDateSelect('desiredDate2', date)}
                                locale={ko}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">희망 화장 회차</Label>
                          <Select
                            value={editFormData.desiredSession2 || ""}
                            onValueChange={(value) => handleEditInputChange("desiredSession2", value)}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="회차 선택" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={String(num)}>
                                  {num}회차
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-reservationOpenDate2" className="text-sm font-medium mb-2 block">
                            예약 오픈 일자
                          </Label>
                          <Popover open={reservationOpenDate2PickerOpen} onOpenChange={setReservationOpenDate2PickerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full h-11 justify-start text-left font-normal hover:bg-gray-50 transition-colors"
                              >
                                <span className="flex-1">
                                  {editFormData.reservationOpenDate2 ? formatDateWithDay(editFormData.reservationOpenDate2) : "년도-월-일"}
                                </span>
                                <Calendar className="h-5 w-5 text-gray-500" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={editFormData.reservationOpenDate2 ? new Date(editFormData.reservationOpenDate2) : undefined}
                                onSelect={(date) => handleEditDateSelect('reservationOpenDate2', date)}
                                locale={ko}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="edit-reservationTime2" className="text-sm font-medium mb-2 block">
                            예약 오픈 시간
                          </Label>
                          <Input
                            id="edit-reservationTime2"
                            placeholder="예) 09:00:00"
                            value={editFormData.reservationTime2 || ""}
                            onChange={(e) => handleEditInputChange("reservationTime2", e.target.value)}
                            className="h-11"
                            maxLength={8}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="py-3">
                <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm" />
              </div>

              <div>
                <div className="bg-amber-50 rounded-lg px-4 py-3 mb-4">
                  <h3 className="text-base font-semibold text-amber-900">추가 정보</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-howDidYouKnow" className="text-sm font-medium mb-2 block">
                      패스트캐치를 알게 된 경로
                    </Label>
                    <Select
                      value={editFormData.howDidYouKnow || ""}
                      onValueChange={(value) => handleEditInputChange("howDidYouKnow", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="경로를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="recommendation">지인 추천</SelectItem>
                        <SelectItem value="funeral-community">장례업계 커뮤니티</SelectItem>
                        <SelectItem value="promotion-sms">홍보문자</SelectItem>
                        <SelectItem value="blog">블로그</SelectItem>
                        <SelectItem value="search">인터넷 검색</SelectItem>
                        <SelectItem value="sns">SNS (페이스북, 인스타그램 등)</SelectItem>
                        <SelectItem value="youtube">유튜브</SelectItem>
                        <SelectItem value="advertisement">광고</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-additionalRequest" className="text-sm font-medium mb-2 block">
                      추가 요청사항
                    </Label>
                    <textarea
                      id="edit-additionalRequest"
                      value={editFormData.additionalRequest || ""}
                      onChange={(e) => handleEditInputChange("additionalRequest", e.target.value)}
                      className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="추가 요청사항을 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-600">
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent className="sm:max-w-[425px] w-[calc(100vw-2rem)] sm:w-full mt-8 sm:mt-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">예약 취소 확인</DialogTitle>
              <DialogDescription className="text-base pt-4">
                정말로 접수된 예약을 취소하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                아니오
              </Button>
              <Button onClick={handleConfirmCancel} className="bg-red-500 hover:bg-red-600">
                예, 취소합니다
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
