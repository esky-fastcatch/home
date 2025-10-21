
import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Edit3, Archive, FileEdit } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const handleServiceClick = (serviceType) => {
    if (serviceType === "regular-modify") {
      navigate(createPageUrl("RegularModify"));
      return;
    }
    
    if (serviceType === "regular-new") {
      navigate(createPageUrl("RegularNew"));
      return;
    }

    if (serviceType === "cremated-new") {
      navigate(createPageUrl("CrematedNew"));
      return;
    }

    if (serviceType === "cremated-modify") {
      navigate(createPageUrl("CrematedModify"));
      return;
    }

    alert("알 수 없는 서비스 유형입니다.");
  };

  const ServiceButton = ({ icon: Icon, title, description, onClick, bgColor, iconColor, disabled }) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full p-4 ${bgColor} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'} rounded-3xl transition-all duration-200 shadow-sm ${!disabled && 'hover:shadow-md'} group relative`}
    >
      {disabled && (
        <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
          서비스 준비중
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-full ${iconColor} flex items-center justify-center ${!disabled && 'group-hover:scale-105'} transition-transform duration-200`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-0.5">
            {title}
          </h3>
          <p className="text-xs text-gray-700">
            {description}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 px-6 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Welcome Message & Main Title */}
        <div className="text-center mb-6">
          <p className="text-base text-gray-600 mb-1">
            안녕하세요. 패스트캐치입니다!
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            원하시는 서비스를 선택해 주세요.
          </h2>
        </div>

        {/* Service Options */}
        <div className="space-y-3">
          {/* 일반시신 섹션 */}
          <ServiceButton
            icon={Calendar}
            title="일반시신 신규예약"
            description="새로운 화장 예약이 필요하신 분"
            onClick={() => handleServiceClick("regular-new")}
            bgColor="bg-blue-100"
            iconColor="bg-blue-500"
          />

          <ServiceButton
            icon={Edit3}
            title="일반시신 예약변경"
            description="기존 예약 정보를 변경하시는 분"
            onClick={() => handleServiceClick("regular-modify")}
            bgColor="bg-indigo-100"
            iconColor="bg-indigo-500"
          />

          {/* 구분선 */}
          <div className="py-3">
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm" />
          </div>

          {/* 개장유골 섹션 */}
          <ServiceButton
            icon={Archive}
            title="개장유골 신규예약"
            description="개장 유골을 위한 화장 예약이 필요하신 분"
            onClick={() => handleServiceClick("cremated-new")}
            bgColor="bg-purple-100"
            iconColor="bg-purple-500"
          />

          <ServiceButton
            icon={FileEdit}
            title="개장유골 예약변경"
            description="개장 유골 예약 정보를 변경하시는 분"
            onClick={() => handleServiceClick("cremated-modify")}
            bgColor="bg-violet-100"
            iconColor="bg-violet-500"
          />
        </div>

        {/* Bottom Info */}
        <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">i</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-5">안내사항</h4>
            </div>
          </div>
          <div className="mt-2">
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 text-center">•</span>
                <span className="flex-1">패스트캐치의 모든 서비스는 무료로 접수 가능하며, 성공 시에만 수수료를 지급하는 방식입니다.<br />
                예약 실패 시, 어떠한 비용도 청구되지 않으니 부담없이 접수 부탁드립니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 text-center">•</span>
                <span className="flex-1">예약 진행시 신청자의 휴대폰 본인인증이 필요하므로, 예약 오픈 30분 전부터는 연락 가능 상태를 유지해주세요.<br />
                (본인인증 불가 시, 예약을 진행할 수 없습니다.)</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200 flex items-start gap-2">
              <span className="flex-shrink-0 w-5 text-center text-xs text-gray-700">※</span>
              <p className="flex-1 text-xs text-gray-700">
                그 외 긴급 문의 및 도움이 필요하신 분은 아래 전화번호로 연락바랍니다.<br />
                <span className="font-semibold">010-7594-1133</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
