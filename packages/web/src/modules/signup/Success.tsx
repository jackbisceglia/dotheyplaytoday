type SuccessProps = {
  readonly hidden: boolean;
  readonly titleRef: (element: HTMLHeadingElement) => void;
};

export function Success(props: SuccessProps) {
  return (
    <div
      class="signup-success"
      hidden={props.hidden}
      role="status"
      aria-atomic="true"
    >
      <h3 class="signup-success-title" tabindex="-1" ref={props.titleRef}>
        Check your email to start your updates.
      </h3>
      <p class="signup-success-copy">
        Your teams and schedule are saved. Confirm your email to start receiving
        updates.
      </p>
      <a class="btn btn-secondary" href="/sign-in">
        Request another link
      </a>
    </div>
  );
}
