import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import StepIndicator from "@/components/reservations/StepIndicator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { base44 } from "@/api/base44Client";

export default function CrematedNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReservationNumber, setSubmittedReservationNumber] = useState("");

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date2PickerOpen, setDate2PickerOpen] = useState(false);

  const [showSecondChoice, setShowSecondChoice] = useState(false);
  const [errors, setErrors] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(true);

  const [formData, setFormData] = useState({
    applicantName: "",
    applicantResidentNumber: "",
    applicantTelecom: "",
    applicantPhoneNumber: "",
    applicantAddress: "",
    relationshipToDeceased: "",
    deceasedName: "",
    deceasedManagementNumber: "",
    coDeceasedName: "",
    coDeceasedManagementNumber: "",
    funeralLocation: "",
    funeralLocationContact: "",
    region: "",
    crematorium: "",
    desiredDate: format(new Date(), "yyyy-MM-dd"),
    desiredSession: "",
    reservationOpenDate: format(new Date(), "yyyy-MM-dd"),
    reservationTime: "",
    region2: "",
    crematorium2: "",
    desiredDate2: format(new Date(), "yyyy-MM-dd"),
    desiredSession2: "",
    reservationOpenDate2: format(new Date(), "yyyy-MM-dd"),
    reservationTime2: "",
    howDidYouKnow: "",
    additionalRequest: ""
  });

  const steps = [
    { number: 1, label: "신청자 정보" },
    { number: 2, label: "고인 정보" },
    { number: 3, label: "희망 화장 정보" },
    { number: 4, label: "추가 정보" }
  ];

  const formatDateWithDay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string provided to formatDateWithDay:", dateString);
      return dateString;
    }
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    return `${dateString} (${dayOfWeek})`;
  };

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

  const formatResidentNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 6) return numbers;
    return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
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

  const formatManagementNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8, 14)}`;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'applicantResidentNumber') {
      formattedValue = formatResidentNumber(value);
    } else if (field === 'applicantPhoneNumber') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'deceasedManagementNumber') {
      formattedValue = formatManagementNumber(value);
    } else if (field === 'coDeceasedManagementNumber') {
      formattedValue = formatManagementNumber(value);
    } else if (field === 'funeralLocationContact') {
      formattedValue = value.replace(/[^0-9-]/g, '');
    } else if (field === 'reservationTime' || field === 'reservationTime2') {
      formattedValue = formatTime(value);
    } else if (field === 'region') {
      setFormData(prev => ({ ...prev, [field]: value, crematorium: "" }));
      return;
    } else if (field === 'region2') {
      setFormData(prev => ({ ...prev, [field]: value, crematorium2: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateSelect = (field, date) => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: format(date, "yyyy-MM-dd") }));
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      if (field === 'desiredDate') setDatePickerOpen(false);
      else if (field === 'desiredDate2') setDate2PickerOpen(false);
    }
  };

  const handleNext = async () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.applicantName) newErrors.applicantName = "신청자 이름을 입력해주세요";
      else if (formData.applicantName.length < 2) newErrors.applicantName = "신청자 이름을 2자 이상 입력해주세요";
      if (!formData.applicantResidentNumber) newErrors.applicantResidentNumber = "주민번호를 입력해주세요";
      else if (formData.applicantResidentNumber.length !== 8) newErrors.applicantResidentNumber = "주민번호를 정확히 입력해주세요 (예: 900101-1)";
      if (!formData.applicantTelecom) newErrors.applicantTelecom = "통신사를 선택해주세요";
      if (!formData.applicantPhoneNumber) newErrors.applicantPhoneNumber = "전화번호를 입력해주세요";
      else if (formData.applicantPhoneNumber.replace(/-/g, '').length < 10) newErrors.applicantPhoneNumber = "전화번호를 정확히 입력해주세요";
      if (!formData.applicantAddress) newErrors.applicantAddress = "주소를 입력해주세요";
      if (!formData.relationshipToDeceased) newErrors.relationshipToDeceased = "고인과의 관계를 선택해주세요";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "필수 입력값을 확인해주세요",
          description: "빨간색으로 표시된 항목을 입력해주세요",
          variant: "destructive",
        });
        return;
      }
      setErrors({});
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.deceasedName) newErrors.deceasedName = "고인 성명을 입력해주세요";
      if (!formData.deceasedManagementNumber) newErrors.deceasedManagementNumber = "고인 개장신고 관리번호를 입력해주세요";
      else if (formData.deceasedManagementNumber.replace(/-/g, '').length !== 14) newErrors.deceasedManagementNumber = "관리번호를 정확히 입력해주세요 (14자리)";
      if (!formData.funeralLocation) newErrors.funeralLocation = "묘지 또는 봉안된 장소를 입력해주세요";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "필수 입력값을 확인해주세요",
          description: "빨간색으로 표시된 항목을 입력해주세요",
          variant: "destructive",
        });
        return;
      }
      setErrors({});
      setCurrentStep(3);
    } else if (currentStep === 3) {

      if (!formData.region) newErrors.region = "지역을 선택해주세요";
      if (!formData.crematorium) newErrors.crematorium = "화장장을 선택해주세요";
      if (!formData.desiredDate) newErrors.desiredDate = "희망 화장 일정을 선택해주세요";
      if (!formData.desiredSession) newErrors.desiredSession = "희망 화장 회차 정보를 입력해주세요.";
      else if (parseInt(formData.desiredSession) < 1 || parseInt(formData.desiredSession) > 30) newErrors.desiredSession = "희망 화장 회차는 1부터 30 사이의 숫자로 입력해주세요.";

      if (showSecondChoice) {
        if (!formData.region2) newErrors.region2 = "2순위 지역을 선택해주세요";
        if (!formData.crematorium2) newErrors.crematorium2 = "2순위 화장장을 선택해주세요";
        if (!formData.desiredDate2) newErrors.desiredDate2 = "2순위 희망 화장 일정을 선택해주세요";
        if (!formData.desiredSession2) newErrors.desiredSession2 = "2순위 희망 화장 회차 정보를 입력해주세요.";
        else if (parseInt(formData.desiredSession2) < 1 || parseInt(formData.desiredSession2) > 30) newErrors.desiredSession2 = "2순위 희망 화장 회차는 1부터 30 사이의 숫자로 입력해주세요.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "필수 입력값을 확인해주세요",
          description: "빨간색으로 표시된 항목을 입력해주세요",
          variant: "destructive",
        });
        return;
      }
      setErrors({});
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!formData.howDidYouKnow) {
        newErrors.howDidYouKnow = "패스트캐치를 알게 된 경로를 선택해주세요";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "필수 입력값을 확인해주세요",
          description: "빨간색으로 표시된 항목을 입력해주세요",
          variant: "destructive",
        });
        return;
      }

      try {
        const today = format(new Date(), "yyyyMMdd");
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const random2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const generatedReservationNumber = `${today}-${random}-${random2}`;

        const submissionPayload = {
          ...formData,
          reservationNumber: generatedReservationNumber,
          desiredSession: formData.desiredSession,
          reservationOpenDate: formData.reservationOpenDate || null,
          reservationTime: formData.reservationTime || null,

          desiredSession2: showSecondChoice ? (formData.desiredSession2 || null) : null,
          reservationOpenDate2: showSecondChoice ? (formData.reservationOpenDate2 || null) : null,
          reservationTime2: showSecondChoice ? (formData.reservationTime2 || null) : null,

          region2: showSecondChoice ? (formData.region2 || null) : null,
          crematorium2: showSecondChoice ? (formData.crematorium2 || null) : null,
          desiredDate2: showSecondChoice ? (formData.desiredDate2 || null) : null,

          coDeceasedName: formData.coDeceasedName || null,
          coDeceasedManagementNumber: formData.coDeceasedManagementNumber || null,
          funeralLocationContact: formData.funeralLocationContact || null,
          additionalRequest: formData.additionalRequest || null,

          serviceType: "개장유골 신규예약",
          processingStatus: "접수완료",
          successStatus: "대기중"
        };

        await base44.entities.Reservation.create(submissionPayload);

        const emailRecipients = ["hsi8925@gmail.com", "estta39@gmail.com"];

        const telecomLabels = {
          "skt": "SKT",
          "kt": "KT",
          "lgu": "LG U+",
          "skt-mvno": "SKT 알뜰폰",
          "kt-mvno": "KT 알뜰폰",
          "lgu-mvno": "LG U+ 알뜰폰"
        };

        const howDidYouKnowLabels = {
          "recommendation": "지인 추천",
          "funeral-community": "장례업계 커뮤니티",
          "promotion-sms": "홍보문자",
          "blog": "블로그",
          "search": "인터넷 검색",
          "sns": "SNS (페이스북, 인스타그램 등)",
          "youtube": "유튜브",
          "advertisement": "광고",
          "other": "기타"
        };

        const emailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
              새로운 예약이 접수되었습니다
            </h2>

            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">📋 서비스 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>서비스 유형:</strong> 개장유골 신규예약</li>
                <li><strong>예약번호:</strong> ${generatedReservationNumber}</li>
                <li><strong>접수 시각:</strong> ${new Date().toLocaleString('ko-KR')}</li>
              </ul>
            </div>

            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">👤 신청자 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>성명:</strong> ${formData.applicantName}</li>
                <li><strong>전화번호:</strong> ${formData.applicantPhoneNumber}</li>
                <li><strong>통신사:</strong> ${telecomLabels[formData.applicantTelecom] || formData.applicantTelecom}</li>
                <li><strong>주소:</strong> ${formData.applicantAddress || '-'}</li>
                <li><strong>고인과의 관계:</strong> ${formData.relationshipToDeceased || '-'}</li>
              </ul>
            </div>

            <div style="background-color: #faf5ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">🕊️ 고인 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>고인 성명:</strong> ${formData.deceasedName}</li>
                <li><strong>관리번호:</strong> ${formData.deceasedManagementNumber}</li>
                ${formData.coDeceasedName ? `<li><strong>합장자 성명:</strong> ${formData.coDeceasedName}</li>` : ''}
                ${formData.coDeceasedManagementNumber ? `<li><strong>합장자 관리번호:</strong> ${formData.coDeceasedManagementNumber}</li>` : ''}
                <li><strong>장례장소:</strong> ${formData.funeralLocation || '-'}</li>
                ${formData.funeralLocationContact ? `<li><strong>장례 장소 연락처:</strong> ${formData.funeralLocationContact}</li>` : ''}
              </ul>
            </div>

            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">🏛️ 1순위 희망 화장 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>화장장:</strong> ${formData.crematorium}</li>
                <li><strong>희망 일정:</strong> ${formData.desiredDate} ${formData.desiredSession}회차</li>
              </ul>
            </div>

            ${showSecondChoice ? `
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">🏛️ 2순위 희망 화장 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>화장장:</strong> ${formData.crematorium2 || '-'}</li>
                <li><strong>희망 일정:</strong> ${formData.desiredDate2 || '-'} ${formData.desiredSession2 || '-'}회차</li>
              </ul>
            </div>
            ` : ''}

            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">📝 추가 정보</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>알게 된 경로:</strong> ${howDidYouKnowLabels[formData.howDidYouKnow] || formData.howDidYouKnow}</li>
                <li><strong>추가 요청사항:</strong> ${formData.additionalRequest || '-'}</li>
              </ul>
            </div>

            <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 15px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>패스트캐치 예약 시스템 자동 발송 메일입니다.</p>
            </div>
          </div>
        `;

        for (const recipient of emailRecipients) {
          try {
            await base44.integrations.Core.SendEmail({
              from_name: "패스트캐치",
              to: recipient,
              subject: `[패스트캐치] 새 예약 접수 - ${generatedReservationNumber}`,
              body: emailBody
            });
          } catch (emailError) {
            console.error(`Failed to send email to ${recipient}:`, emailError);
          }
        }

        setSubmittedReservationNumber(generatedReservationNumber);
        setIsSubmitted(true);
        setErrors({});
      } catch (error) {
        toast({
          title: "저장 실패",
          description: "예약 정보 저장 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        console.error("Failed to create reservation:", error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNewApplication = () => {
    navigate(createPageUrl("MyReservations") + `?reservationNumber=${submittedReservationNumber}`);
  };

  const availableCrematoriums = formData.region ? (crematoriumsByRegion[formData.region] || []) : [];
  const availableCrematoriums2 = formData.region2 ? (crematoriumsByRegion[formData.region2] || []) : [];

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-8 px-6 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              신청이 완료되었습니다
            </h2>

            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
              예약 대행 신청이 성공적으로 접수되었습니다.
            </p>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              추가 안내사항은 별도 연락 드리겠습니다.
            </p>

            <Button
              onClick={handleNewApplication}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-base font-medium"
            >
              나의 예약 정보 확인
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-6 sm:px-6 lg:px-8 bg-gray-50">
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="sm:max-w-[500px] w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              예약 접수 전 필수 확인사항
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                개장신고를 진행하지 않으신 경우, 화장 예약이 불가합니다. <span className="font-bold underline">반드시 개장신고 이후</span>에 예약 접수 부탁드립니다.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowInfoModal(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 h-11"
            >
              확인했습니다
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <style>{`
            @media (max-width: 640px) {
              input::placeholder, select::placeholder {
                font-size: 0.86rem;
              }
              .placeholder-small::placeholder {
                font-size: 0.86rem;
              }
            }
            input, select, [role="combobox"] {
              font-size: 0.92rem;
            }
          `}</style>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            개장유골 신규 예약 신청
          </h1>

          <StepIndicator currentStep={currentStep} steps={steps} />

          {currentStep === 1 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                신청자 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicantName" className="text-gray-700 font-medium mb-2 block">
                      신청자 이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantName"
                      placeholder="예) 홍길동"
                      value={formData.applicantName}
                      onChange={(e) => handleInputChange("applicantName", e.target.value)}
                      className={`h-12 text-base ${errors.applicantName ? 'border-red-500' : ''}`}
                    />
                    {errors.applicantName && (
                      <p className="text-xs text-red-500 mt-1">{errors.applicantName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="applicantResidentNumber" className="text-gray-700 font-medium mb-2 block">
                      주민번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantResidentNumber"
                      placeholder="예) 900101-1"
                      value={formData.applicantResidentNumber}
                      onChange={(e) => handleInputChange("applicantResidentNumber", e.target.value)}
                      className={`h-12 text-base ${errors.applicantResidentNumber ? 'border-red-500' : ''}`}
                      maxLength={8}
                    />
                    {errors.applicantResidentNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.applicantResidentNumber}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 -mt-4">
                  뒷자리는 첫 번째 숫자만 입력 (총 7자리)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicantTelecom" className="text-gray-700 font-medium mb-2 block">
                      통신사 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.applicantTelecom} onValueChange={(value) => handleInputChange("applicantTelecom", value)}>
                      <SelectTrigger className={`h-12 text-base placeholder-small ${errors.applicantTelecom ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="통신사를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skt">SKT</SelectItem>
                        <SelectItem value="kt">KT</SelectItem>
                        <SelectItem value="lgu">LG U+</SelectItem>
                        <SelectItem value="skt-mvno">SKT 알뜰폰</SelectItem>
                        <SelectItem value="kt-mvno">KT 알뜰폰</SelectItem>
                        <SelectItem value="lgu-mvno">LG U+ 알뜰폰</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.applicantTelecom && (
                      <p className="text-xs text-red-500 mt-1">{errors.applicantTelecom}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="applicantPhoneNumber" className="text-gray-700 font-medium mb-2 block">
                      전화번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="applicantPhoneNumber"
                      placeholder="예) 010-1234-5678"
                      value={formData.applicantPhoneNumber}
                      onChange={(e) => handleInputChange("applicantPhoneNumber", e.target.value)}
                      className={`h-12 text-base ${errors.applicantPhoneNumber ? 'border-red-500' : ''}`}
                      maxLength={13}
                    />
                    {errors.applicantPhoneNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.applicantPhoneNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="applicantAddress" className="text-gray-700 font-medium mb-2 block">
                    주소 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="applicantAddress"
                    placeholder="예) 서울시 강남구 테헤란로 123"
                    value={formData.applicantAddress}
                    onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
                    className={`h-12 text-base ${errors.applicantAddress ? 'border-red-500' : ''}`}
                  />
                  {errors.applicantAddress && (
                    <p className="text-xs text-red-500 mt-1">{errors.applicantAddress}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="relationshipToDeceased" className="text-gray-700 font-medium mb-2 block">
                    고인과의 관계 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.relationshipToDeceased} onValueChange={(value) => handleInputChange("relationshipToDeceased", value)}>
                    <SelectTrigger className={`h-12 text-base placeholder-small ${errors.relationshipToDeceased ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="고인과의 관계를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="배우자">배우자</SelectItem>
                      <SelectItem value="자녀">자녀</SelectItem>
                      <SelectItem value="부모">부모</SelectItem>
                      <SelectItem value="형제자매">형제자매</SelectItem>
                      <SelectItem value="친척">친척</SelectItem>
                      <SelectItem value="대행">대행</SelectItem>
                      <SelectItem value="지인">지인</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.relationshipToDeceased && (
                    <p className="text-xs text-red-500 mt-1">{errors.relationshipToDeceased}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                고인 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deceasedName" className="text-gray-700 font-medium mb-2 block">
                      고인 성명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deceasedName"
                      placeholder="예) 홍길동"
                      value={formData.deceasedName}
                      onChange={(e) => handleInputChange("deceasedName", e.target.value)}
                      className={`h-12 text-base ${errors.deceasedName ? 'border-red-500' : ''}`}
                    />
                    {errors.deceasedName && (
                      <p className="text-xs text-red-500 mt-1">{errors.deceasedName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="deceasedManagementNumber" className="text-gray-700 font-medium mb-2 block">
                      고인 개장신고 관리번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deceasedManagementNumber"
                      placeholder="예) 1234-1234-123456"
                      value={formData.deceasedManagementNumber}
                      onChange={(e) => handleInputChange("deceasedManagementNumber", e.target.value)}
                      className={`h-12 text-base ${errors.deceasedManagementNumber ? 'border-red-500' : ''}`}
                      maxLength={16}
                    />
                    {errors.deceasedManagementNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.deceasedManagementNumber}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-4">
                  숫자 14자리를 입력해주세요.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coDeceasedName" className="text-gray-700 font-medium mb-2 block">
                      합장자 성명
                    </Label>
                    <Input
                      id="coDeceasedName"
                      placeholder="(합장자가 있는 경우에만 입력)"
                      value={formData.coDeceasedName}
                      onChange={(e) => handleInputChange("coDeceasedName", e.target.value)}
                      className={`h-12 text-base ${errors.coDeceasedName ? 'border-red-500' : ''}`}
                    />
                    {errors.coDeceasedName && (
                      <p className="text-xs text-red-500 mt-1">{errors.coDeceasedName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="coDeceasedManagementNumber" className="text-gray-700 font-medium mb-2 block">
                      합장자 개장신고 관리번호
                    </Label>
                    <Input
                      id="coDeceasedManagementNumber"
                      placeholder="예) 1234-1234-123456"
                      value={formData.coDeceasedManagementNumber}
                      onChange={(e) => handleInputChange("coDeceasedManagementNumber", e.target.value)}
                      className={`h-12 text-base ${errors.coDeceasedManagementNumber ? 'border-red-500' : ''}`}
                      maxLength={16}
                    />
                    {errors.coDeceasedManagementNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.coDeceasedManagementNumber}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-4">
                  숫자 14자리를 입력해주세요.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="funeralLocation" className="text-gray-700 font-medium mb-2 block">
                      묘지 또는 봉안된 장소 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="funeralLocation"
                      placeholder="예) 서울시 강남구 개포동 산 99-1"
                      value={formData.funeralLocation}
                      onChange={(e) => handleInputChange("funeralLocation", e.target.value)}
                      className={`h-12 text-base ${errors.funeralLocation ? 'border-red-500' : ''}`}
                    />
                    {errors.funeralLocation && (
                      <p className="text-xs text-red-500 mt-1">{errors.funeralLocation}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="funeralLocationContact" className="text-gray-700 font-medium mb-2 block">
                      장례 장소 연락처
                    </Label>
                    <Input
                      id="funeralLocationContact"
                      placeholder="예) 02-123-4567"
                      value={formData.funeralLocationContact}
                      onChange={(e) => handleInputChange("funeralLocationContact", e.target.value)}
                      className={`h-12 text-base ${errors.funeralLocationContact ? 'border-red-500' : ''}`}
                    />
                    {errors.funeralLocationContact && (
                      <p className="text-xs text-red-500 mt-1">{errors.funeralLocationContact}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-4">
                  개장신고(허가)서 상의 [묘지또는 봉안된 장소]의 주소를 정확하게 입력하여 주시기 바랍니다.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                희망 화장 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg px-4 py-2 mb-4">
                  <h3 className="text-base font-semibold text-blue-900">1순위 정보</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region" className="text-gray-700 font-medium mb-2 block">
                        지역 선택 <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                        <SelectTrigger className={`h-12 text-base placeholder-small ${errors.region ? 'border-red-500' : ''}`}>
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
                      {errors.region && (
                        <p className="text-xs text-red-500 mt-1">{errors.region}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="crematorium" className="text-gray-700 font-medium mb-2 block">
                        화장장 이름 <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.crematorium}
                        onValueChange={(value) => handleInputChange("crematorium", value)}
                        disabled={!formData.region}
                      >
                        <SelectTrigger className={`h-12 text-base placeholder-small ${errors.crematorium ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder={formData.region ? "화장장을 선택하세요" : "지역을 먼저 선택하세요"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {availableCrematoriums.map((crematorium) => (
                            <SelectItem key={crematorium.value} value={crematorium.label}>
                              {crematorium.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.crematorium && (
                        <p className="text-xs text-red-500 mt-1">{errors.crematorium}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="desiredDate" className={`text-gray-700 font-medium mb-2 block ${errors.desiredDate ? 'text-red-500' : ''}`}>
                        희망 화장 일정 <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full h-12 justify-start text-left font-normal text-base hover:bg-gray-50 transition-colors ${errors.desiredDate ? 'border-red-500' : ''}`}
                          >
                            <span className="flex-1">
                              {formData.desiredDate ? formatDateWithDay(formData.desiredDate) : "년도-월-일"}
                            </span>
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.desiredDate ? new Date(formData.desiredDate) : undefined}
                            onSelect={(date) => handleDateSelect('desiredDate', date)}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.desiredDate && (
                        <p className="text-xs text-red-500 mt-1">{errors.desiredDate}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="desiredSession" className={`text-gray-700 font-medium mb-2 block ${errors.desiredSession ? 'text-red-500' : ''}`}>
                        희망 화장 회차 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="desiredSession"
                        type="number"
                        min="1"
                        max="30"
                        placeholder="회차를 입력하세요 (예: 1)"
                        value={formData.desiredSession}
                        onChange={(e) => handleInputChange("desiredSession", e.target.value)}
                        className={`h-12 text-base ${errors.desiredSession ? 'border-red-500' : ''}`}
                      />
                      {errors.desiredSession && (
                        <p className="text-xs text-red-500 mt-1">{errors.desiredSession}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-bold">파묘 및 이동 시간을 고려</span>해서 화장 회차를 선정하시는 것을 권장드립니다. 각 화장장별 회차 정보는 아래 링크를 통해서 확인하실 수 있습니다.
                      </p>
                      <p className="pl-4">
                        - 경로: 화장시설안내 → [예약현황] 버튼 → 관내/관외 구분 → 조회
                      </p>
                      <p>
                        ※ <span className="font-bold">"회차 시간정보 + 예약불가"로 되어있는 회차</span> 중에서 선택해주시기 바랍니다.
                      </p>
                      <a
                        href="https://www.15774129.go.kr/funeral/sys2/crem_reserve_facility_list.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all inline-block"
                      >
                        https://www.15774129.go.kr/funeral/sys2/crem_reserve_facility_list.do
                      </a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e43c3db6e987772672f539/1d0be4fd9_.jpeg"
                      alt="화장시설 예약현황 예시"
                      className="w-full rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reservationOpenDate" className="text-gray-700 font-medium mb-2 block">
                        예약 오픈 일자
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-left font-normal text-base hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex-1">
                              {formData.reservationOpenDate ? formatDateWithDay(formData.reservationOpenDate) : "년도-월-일"}
                            </span>
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.reservationOpenDate ? new Date(formData.reservationOpenDate) : undefined}
                            onSelect={(date) => handleDateSelect('reservationOpenDate', date)}
                            locale={ko}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="reservationTime" className="text-gray-700 font-medium mb-2 block">
                        예약 오픈 시간
                      </Label>
                      <Input
                        id="reservationTime"
                        placeholder="예) 09:00:00"
                        value={formData.reservationTime}
                        onChange={(e) => handleInputChange("reservationTime", e.target.value)}
                        className="h-12 text-base"
                        maxLength={8}
                      />
                    </div>
                  </div>
                </div>

                {!showSecondChoice && (
                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSecondChoice(true)}
                      className="w-full h-12 text-base font-medium border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      + 2순위 정보 추가
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      ※ 1순위 예약 실패 시 시도할 2순위 정보를 추가할 수 있습니다.
                    </p>
                  </div>
                )}

                {showSecondChoice && (
                  <>
                    <div className="pt-6 mt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="bg-indigo-50 rounded-lg px-4 py-2">
                          <h3 className="text-base font-semibold text-indigo-900">2순위 정보</h3>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowSecondChoice(false);
                            setFormData(prev => ({
                              ...prev,
                              region2: "",
                              crematorium2: "",
                              desiredDate2: format(new Date(), "yyyy-MM-dd"),
                              desiredSession2: "",
                              reservationOpenDate2: format(new Date(), "yyyy-MM-dd"),
                              reservationTime2: "",
                            }));
                            setErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.region2;
                              delete newErrors.crematorium2;
                              delete newErrors.desiredDate2;
                              delete newErrors.desiredSession2;
                              return newErrors;
                            });
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          삭제
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="region2" className="text-gray-700 font-medium mb-2 block">
                              지역 선택 <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.region2} onValueChange={(value) => handleInputChange("region2", value)}>
                              <SelectTrigger className={`h-12 text-base placeholder-small ${errors.region2 ? 'border-red-500' : ''}`}>
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
                            {errors.region2 && (
                              <p className="text-xs text-red-500 mt-1">{errors.region2}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="crematorium2" className="text-gray-700 font-medium mb-2 block">
                              화장장 이름 <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.crematorium2}
                              onValueChange={(value) => handleInputChange("crematorium2", value)}
                              disabled={!formData.region2}
                            >
                              <SelectTrigger className={`h-12 text-base placeholder-small ${errors.crematorium2 ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder={formData.region2 ? "화장장을 선택하세요" : "지역을 먼저 선택하세요"} />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {availableCrematoriums2.map((crematorium) => (
                                  <SelectItem key={crematorium.value} value={crematorium.label}>
                                    {crematorium.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.crematorium2 && (
                              <p className="text-xs text-red-500 mt-1">{errors.crematorium2}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="desiredDate2" className={`text-gray-700 font-medium mb-2 block ${errors.desiredDate2 ? 'text-red-500' : ''}`}>
                              희망 화장 일정
                            </Label>
                            <Popover open={date2PickerOpen} onOpenChange={setDate2PickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-full h-12 justify-start text-left font-normal text-base hover:bg-gray-50 transition-colors ${errors.desiredDate2 ? 'border-red-500' : ''}`}
                                >
                                  <span className="flex-1">
                                    {formData.desiredDate2 ? formatDateWithDay(formData.desiredDate2) : "년도-월-일"}
                                  </span>
                                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={formData.desiredDate2 ? new Date(formData.desiredDate2) : undefined}
                                  onSelect={(date) => handleDateSelect('desiredDate2', date)}
                                  locale={ko}
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.desiredDate2 && (
                              <p className="text-xs text-red-500 mt-1">{errors.desiredDate2}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="desiredSession2" className={`text-gray-700 font-medium mb-2 block ${errors.desiredSession2 ? 'border-red-500' : ''}`}>
                              희망 화장 회차
                            </Label>
                            <Input
                              id="desiredSession2"
                              type="number"
                              min="1"
                              max="30"
                              placeholder="회차를 입력하세요 (예: 1)"
                              value={formData.desiredSession2}
                              onChange={(e) => handleInputChange("desiredSession2", e.target.value)}
                              className={`h-12 text-base ${errors.desiredSession2 ? 'border-red-500' : ''}`}
                            />
                            {errors.desiredSession2 && (
                              <p className="text-xs text-red-500 mt-1">{errors.desiredSession2}</p>
                            )}
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>
                              <span className="font-bold">파묘 및 이동 시간을 고려</span>해서 화장 회차를 선정하시는 것을 권장드립니다. 각 화장장별 회차 정보는 아래 링크를 통해서 확인하실 수 있습니다.
                            </p>
                            <p className="pl-4">
                              - 경로: 화장시설안내 → [예약현황] 버튼 → 관내/관외 구분 → 조회
                            </p>
                            <p>
                              ※ <span className="font-bold">"회차 시간정보 + 예약불가"로 되어있는 회차</span> 중에서 선택해주시기 바랍니다.
                            </p>
                            <a
                              href="https://www.15774129.go.kr/funeral/sys2/crem_reserve_facility_list.do"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all inline-block"
                            >
                              https://www.15774129.go.kr/funeral/sys2/crem_reserve_facility_list.do
                            </a>
                          </div>
                        </div>

                        <div className="mt-4">
                          <img
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e43c3db6e987772672f539/1d0be4fd9_.jpeg"
                            alt="화장시설 예약현황 예시"
                            className="w-full rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="reservationOpenDate2" className="text-gray-700 font-medium mb-2 block">
                              예약 오픈 일자
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full h-12 justify-start text-left font-normal text-base hover:bg-gray-50 transition-colors"
                                >
                                  <span className="flex-1">
                                    {formData.reservationOpenDate2 ? formatDateWithDay(formData.reservationOpenDate2) : "년도-월-일"}
                                  </span>
                                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={formData.reservationOpenDate2 ? new Date(formData.reservationOpenDate2) : undefined}
                                  onSelect={(date) => handleDateSelect('reservationOpenDate2', date)}
                                  locale={ko}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label htmlFor="reservationTime2" className="text-gray-700 font-medium mb-2 block">
                              예약 오픈 시간
                            </Label>
                            <Input
                              id="reservationTime2"
                              placeholder="예) 09:00:00"
                              value={formData.reservationTime2}
                              onChange={(e) => handleInputChange("reservationTime2", e.target.value)}
                              className="h-12 text-base"
                              maxLength={8}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                추가 정보
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                * 표시된 항목은 필수 입력 사항입니다
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="howDidYouKnow" className="text-gray-700 font-medium mb-2 block">
                    패스트캐치를 알게 된 경로 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.howDidYouKnow} onValueChange={(value) => handleInputChange("howDidYouKnow", value)}>
                    <SelectTrigger className={`h-12 text-base placeholder-small ${errors.howDidYouKnow ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="서비스를 알게 된 경로를 선택하세요" />
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
                  {errors.howDidYouKnow && (
                    <p className="text-xs text-red-500 mt-1">{errors.howDidYouKnow}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="additionalRequest" className="text-gray-700 font-medium mb-2 block">
                    추가 요청사항
                  </Label>
                  <textarea
                    id="additionalRequest"
                    placeholder="추가로 전달하고 싶은 내용이 있다면 입력해주세요"
                    value={formData.additionalRequest}
                    onChange={(e) => handleInputChange("additionalRequest", e.target.value)}
                    className="w-full h-32 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    특별한 요청사항이나 문의사항을 자유롭게 작성해주세요
                  </p>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">패스트캐치 안내사항</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p className="leading-relaxed">
                      ① 패스트캐치는 높은 경쟁률 속에서도 성공률을 높이기 위해 최선을 다하고 있습니다.<br />
                      다만, 시스템 구조상 예약 실패 가능성도 존재하는 점 양해 부탁드립니다.
                    </p>
                    <p className="leading-relaxed">
                      ② 본 서비스는 후불 결제 방식으로 운영됩니다.<br />
                      예약 실패 시, 어떠한 비용도 청구되지 않으며, 예약 성공 시에만 성공수당을 입금해주시면 됩니다.
                    </p>
                    <p className="leading-relaxed font-medium">
                      원하시는 일정에 화장이 이루어질 수 있도록 최선을 다하겠습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="px-4 py-2 h-11 text-base sm:px-6 sm:py-3 sm:h-12"
              disabled={currentStep === 1}
            >
              이전
            </Button>
            <Button
              onClick={handleNext}
              className="px-5 py-2 h-11 text-base bg-blue-500 hover:bg-blue-600 sm:px-8 sm:py-3 sm:h-12"
            >
              {currentStep === 4 ? "신청 완료" : "다음"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}