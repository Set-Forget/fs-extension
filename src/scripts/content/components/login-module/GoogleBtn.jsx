/*import { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { UserContext } from "../../context/user";

const GoogleBtn = () => {
  const { setUser } = useContext(UserContext);

  const login = useGoogleLogin({  
    onSuccess: (response) => {
      localStorage.setItem("userData", JSON.stringify(response));
      setUser(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <button
      onClick={login}
      className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-3 text-neutral-800 dark:text-neutral-50 border border-solid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1_3)">
          <path
            d="M18 9.19954C18.0109 8.58081 17.9457 7.96306 17.8059 7.3596H9.18367V10.6995H14.2448C14.149 11.2852 13.9332 11.8457 13.6106 12.3475C13.2879 12.8493 12.865 13.282 12.3673 13.6195L12.3497 13.7314L15.076 15.8011L15.2648 15.8196C16.9994 14.2496 17.9996 11.9395 17.9996 9.19954"
            fill="#4285F4"
          />
          <path
            d="M9.18367 18C11.6632 18 13.7448 17.1999 15.2654 15.8199L12.3673 13.6198C11.5919 14.15 10.5511 14.52 9.18367 14.52C8.02235 14.5133 6.89265 14.1485 5.95485 13.4771C5.01706 12.8058 4.31879 11.8621 3.95912 10.7799L3.8515 10.7889L1.01664 12.9389L0.979592 13.0399C1.74309 14.5311 2.9148 15.7848 4.36371 16.6607C5.81261 17.5367 7.48159 18.0004 9.18403 18"
            fill="#34A853"
          />
          <path
            d="M3.95917 10.7799C3.75829 10.2071 3.65464 9.60577 3.65234 9C3.65604 8.39523 3.75586 7.79471 3.94823 7.22006L3.94311 7.10075L1.0735 4.9162L0.979633 4.95995C0.335561 6.21312 7.43866e-05 7.59676 7.43866e-05 8.99992C7.43866e-05 10.4031 0.335561 11.7867 0.979633 13.0399L3.95917 10.7799Z"
            fill="#FBBC05"
          />
          <path
            d="M9.18367 3.47979C10.4996 3.45977 11.7723 3.94005 12.7347 4.81985L15.3266 2.33979C13.6642 0.811491 11.4629 -0.0270694 9.18367 -0.00020553C7.48126 -0.000602475 5.81229 0.463087 4.36339 1.33901C2.91448 2.21494 1.74276 3.46857 0.979239 4.95974L3.94889 7.21985C4.3121 6.13787 5.01268 5.19491 5.95186 4.5239C6.89104 3.85289 8.02143 3.4877 9.18367 3.47979Z"
            fill="#EB4335"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_3">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span className="text-sm font-normal leading-6">
        Sign in with <span className="font-semibold">Google</span>
      </span>
    </button>
  );
};

export default GoogleBtn;*/
