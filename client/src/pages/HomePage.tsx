import React from 'react';
import { Sprout, Leaf, BarChart3, Users } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sprout className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Agri Dom</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Giải pháp quản lý nông nghiệp thông minh cho nông dân Việt Nam
          </p>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Quản lý cây trồng</h3>
            </div>
            <p className="text-gray-600">
              Theo dõi và quản lý cây trồng một cách hiệu quả với công nghệ hiện đại
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Thống kê doanh thu</h3>
            </div>
            <p className="text-gray-600">
              Phân tích doanh thu và lợi nhuận để tối ưu hóa hoạt động kinh doanh
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Kết nối cộng đồng</h3>
            </div>
            <p className="text-gray-600">
              Kết nối với cộng đồng nông dân để chia sẻ kinh nghiệm và học hỏi
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bắt đầu hành trình nông nghiệp thông minh
            </h2>
            <p className="text-gray-600 mb-6">
              Tham gia cùng hàng nghìn nông dân đã tin tưởng sử dụng Agri Dom
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Đăng ký ngay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;