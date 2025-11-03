import MainAreaLayout from '@/components/layout';
import { AuthCheck } from '@/app/auth-check';

const Page = () => {
  return (
    <MainAreaLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold tracking-tight">
            Dasbor Divisi Pelaksana Program
          </h1>
    <AuthCheck>
      <MainAreaLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl">
            <h1 className="text-3xl font-bold tracking-tight">
              Dasbor Divisi Pelaksana Program
            </h1>
          </div>
        </div>
      </div>
    </MainAreaLayout>
      </MainAreaLayout>
    </AuthCheck>
  );
};

export default Page;
