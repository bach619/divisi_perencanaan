import MainAreaLayout from '@/components/layout';
import { AuthCheck } from '@/app/auth-check';

const Page = () => {
  return (
    <AuthCheck>
      <MainAreaLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl">
            <h1 className="text-3xl font-bold tracking-tight">
              Dasbor Ketua Yayasan
            </h1>
          </div>
        </div>
      </MainAreaLayout>
    </AuthCheck>
  );
};

export default Page;
